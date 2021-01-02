import { IUserRepository, User, UserEmail, UserPassword } from "modules/users/domain/user";
import { CreateUserCommand } from "./create-user.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Result } from "shared/core";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private repository: IUserRepository) {}

  async execute(command: CreateUserCommand) {
    const { firstName, lastName } = command;
    const emailOrError = UserEmail.create(command.email);
    const passwordOrError = UserPassword.create({ value: command.password });

    const dtoResult = Result.combine([emailOrError, passwordOrError]);

    if (dtoResult.isFailure) {
      throw new Error(dtoResult.error.toString());
    }

    const email: UserEmail = emailOrError.getValue();
    const password: UserPassword = passwordOrError.getValue();

    const userAlreadyExists = await this.repository.exists(email);

    if (userAlreadyExists) {
      throw new Error("email already taken.");
    }

    const userOrError: Result<User> = User.create({
      email,
      password,
      firstName,
      lastName,
    });

    if (userOrError.isFailure) {
      throw new Error(userOrError.error.toString());
    }

    const user: User = userOrError.getValue();
    await this.repository.save(user);
  }
}
