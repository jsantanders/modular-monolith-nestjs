import { OrganizationRoles } from '@nestjs-bff/global-contracts/lib/shared/authorization/roles.constants';
import { AuthorizationCheckError } from '../exceptions/authorization-check.exception';
import { AuthCheckContract } from './authcheck.contract';
import { hasOrganizationRole, isStaffAdmin } from './authcheck.utils';
import { AuthorizationCheckParams } from './authorization-params';
import { ScopedData } from './scoped-data';

export class UserAccessAuthCheck extends AuthCheckContract<ScopedData, any> {
  constructor() {
    super();
  }

  public async isAuthorized(params: AuthorizationCheckParams<ScopedData, any>): Promise<boolean> {
    if (!params || !params.targetResource || !params.targetResource.userId) throw new AuthorizationCheckError(params, 'AuthorizationCheckParams - userId can not be null');

    if (!params.accessPermissions) return false;

    // if self, then true
    if (params.accessPermissions.userId && params.accessPermissions.userId.toString() === params.targetResource.userId.toString()) return true;

    // if system admin, then true
    if (isStaffAdmin(params.accessPermissions)) return true;

    // if doesn't have orgId, can't verify access through org scope.  Return false
    if (!params.targetResource.orgId) return false;

    // if org admin, then true
    return hasOrganizationRole(params.accessPermissions, params.targetResource.orgId, [OrganizationRoles.facilitator, OrganizationRoles.admin]);
  }
}
