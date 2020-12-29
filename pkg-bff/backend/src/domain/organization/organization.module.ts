import { Module } from '@nestjs/common';
import { MongoSharedProviderTokens } from '../../shared/database/mongo/mongo.shared.constants';
import { DomainCoreModule } from '../core/core.module';
import { OrganizationSchema } from './model/organization.schema';
import { OrganizationProviderTokens } from './organization.constants';
import { OrganizationRepo } from './repo/organization.repo';

const OrganizationModel = {
  provide: OrganizationProviderTokens.Models.Organization,
  useFactory: mongoose => mongoose.connection.model('Organization', OrganizationSchema),
  inject: [MongoSharedProviderTokens.Connections.Mongoose],
};

@Module({
  imports: [DomainCoreModule],
  providers: [OrganizationRepo, OrganizationModel],
  exports: [OrganizationRepo],
})
export class DomainOrganizationModule {}
