import { Injectable } from '@nestjs/common';
import { IUserRepository, User, UserEmail } from 'modules/users/domain/user';
import { UserMap } from 'modules/users/infra/mappers/user.mapper';
import { EntityManager } from 'typeorm';
import { UserRaw } from '../models';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly manager: EntityManager;

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  async exists(userEmail: UserEmail): Promise<boolean> {
    const userRaw = await this.manager
      .createQueryBuilder(UserRaw, 'user')
      .where('user.email = :email', { email: userEmail.value })
      .getOne();

    return !!userRaw === true;
  }

  async getUserByUserId(userId: string): Promise<User> {
    const userRaw = await this.manager
      .createQueryBuilder(UserRaw, 'user')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!!userRaw === false) throw new Error('User not found.');

    return UserMap.toDomain(userRaw);
  }

  async save(user: User): Promise<void> {
    const userRaw = UserMap.toPersistence(user);
    await this.manager.save(userRaw);
  }
}
