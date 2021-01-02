import { User, UserEmail, UserPassword } from "modules/users/domain/user";
import { UniqueEntityID } from "shared/domain";
import { Mapper } from "shared/infra/mapper";
import { UserRaw } from "../database/models";

export class UserMap implements Mapper<User> {
  public static toDomain(raw: UserRaw): User {
    const userPasswordOrError = UserPassword.create({ value: raw.password, hashed: true });
    const userEmailOrError = UserEmail.create(raw.email);

    const userOrError = User.create(
      {
        firstName: raw.firstName,
        lastName: raw.lastName,
        isDeleted: raw.isDeleted,
        isEmailVerified: raw.isEmailVerified,
        lastLogin: raw.lastLogin,
        password: userPasswordOrError.getValue(),
        email: userEmailOrError.getValue(),
      },
      new UniqueEntityID(raw.id),
    );

    userOrError.isFailure ? console.log(userOrError.error) : "";

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static async toPersistence(user: User): Promise<UserRaw> {
    let password: string = null;
    if (!!user.password === true) {
      if (user.password.isAlreadyHashed()) {
        password = user.password.value;
      } else {
        password = await user.password.getHashedValue();
      }
    }

    return {
      id: user.userId.id.toString(),
      email: user.email.value,
      password: password,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
      isDeleted: user.isDeleted,
      lastLogin: user.lastLogin,
    };
  }
}
