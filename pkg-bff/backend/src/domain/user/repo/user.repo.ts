import { UserEntity } from '@nestjs-bff/global-contracts/lib/domain/user/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { INestjsBffConfig } from '../../../config/nestjs-bff.config';
import { AppSharedProviderTokens } from '../../../shared/app/app.shared.constants';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { CachingProviderTokens } from '../../../shared/caching/caching.shared.constants';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { BaseRepo } from '../../core/repo/base.repo';
import { ClassValidator } from '../../core/validators/class-validator';
import { IUserModel } from '../model/user.model';
import { UserProviderTokens } from '../user.constants';

@Injectable()
export class UserRepo extends BaseRepo<UserEntity> {
  constructor(
    loggerService: LoggerSharedService,
    @Inject(AppSharedProviderTokens.Config.App) nestjsBffConfig: INestjsBffConfig,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(UserProviderTokens.Models.User) model: Model<IUserModel>,
  ) {
    super({
      loggerService,
      model,
      cacheStore,
      entityValidator: new ClassValidator(loggerService, UserEntity),
      defaultTTL: nestjsBffConfig.caching.entities.user,
    });
  }

  protected generateValidQueryConditionsForCacheClear(entity: UserEntity): object[] {
    return [{ username: entity.username }];
  }
}
