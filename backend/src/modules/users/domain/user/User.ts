import { AggregateRoot } from "shared/domain/AggregateRoot";
import { UserEmail } from "./UserEmail";
import { UserPassword } from "./UserPassword";
import { UserId } from "./UserId";
import { JWTToken, RefreshToken } from "./Jwt";
import { UniqueEntityID } from "shared/domain/UniqueEntityID";
import { Guard } from "shared/core/Guard";
import { Result } from "shared/core/Result";
import { UserLoggedIn } from "./events/UserLoggedIn";
import { UserDeleted } from "./events/UserDeleted";
import { UserCreated } from "./events/UserCreated";

interface UserProps {
  email: UserEmail;
  password: UserPassword;
  isEmailVerified?: boolean;
  isAdminUser?: boolean;
  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
  isDeleted?: boolean;
  lastLogin?: Date;
}

export class User extends AggregateRoot<UserProps> {

  get userId (): UserId {
    return UserId.create(this._id)
      .getValue();
  }

  get email (): UserEmail {
    return this.props.email;
  }

  get password (): UserPassword {
    return this.props.password;
  }

  get accessToken (): string {
    return this.props.accessToken;
  }

  get isDeleted (): boolean {
    return this.props.isDeleted;
  }

  get isEmailVerified (): boolean {
    return this.props.isEmailVerified;
  }

  get isAdminUser (): boolean {
    return this.props.isAdminUser;
  }

  get lastLogin (): Date {
    return this.props.lastLogin;
  }

  get refreshToken (): RefreshToken {
    return this.props.refreshToken
  }

  public isLoggedIn (): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken
  }

  public setAccessToken (token: JWTToken, refreshToken: RefreshToken): void {
    this.addDomainEvent(new UserLoggedIn(this));
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
    this.props.lastLogin = new Date();
  }

  public delete (): void {
    if (!this.props.isDeleted) {
      this.addDomainEvent(new UserDeleted(this));
      this.props.isDeleted = true;
    }
  }

  private constructor (props: UserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create (props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.email, argumentName: 'email' },
      { argument: props.password, argumentName: 'password' }
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message)
    }

    const isNewUser = !!id === false;
    const user = new User({
      ...props,
      isDeleted: props.isDeleted ? props.isDeleted : false,
      isEmailVerified: props.isEmailVerified ? props.isEmailVerified : false,
      isAdminUser: props.isAdminUser ? props.isAdminUser : false
    }, id);

    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user));
    }

    return Result.ok<User>(user);
  }
}
