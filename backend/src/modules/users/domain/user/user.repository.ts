import { User, UserEmail } from ".";

export interface IUserRepository {
  exists(userEmail: UserEmail): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  save(user: User): Promise<void>;
}
