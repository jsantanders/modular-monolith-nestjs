import { Module } from '@nestjs/common';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { DomainCoreModule } from '../core/core.module';
import { AccessPermissionsProviderTokens } from './access-permissions.constants';
import { AccessPermissionsSchema } from './model/access-permissions.schema';
import { AccessPermissionsRepo } from './repo/access-permissions.repo';

const AccessPermissionsModel = {
  provide: AccessPermissionsProviderTokens.Models.AccessPermissions,
  useFactory: mongoose => mongoose.connection.model('AccessPermissions', AccessPermissionsSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [DomainCoreModule],
  providers: [AccessPermissionsModel, AccessPermissionsRepo],
  exports: [AccessPermissionsRepo],
})
export class DomainAccessPermissionsModule {}
