import { Inject, Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import { verify, VerifyOptions } from 'jsonwebtoken';
import { INestjsBffConfig } from '../../../../config/nestjs-bff.config';
import { AccessPermissionsEntity } from '../../../../domain/access-permissions/model/access-permissions.entity';
import { AccessPermissionsRepo } from '../../../../domain/access-permissions/repo/access-permissions.repo';
import { AppSharedProviderTokens } from '../../../../shared/app/app.shared.constants';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { BadRequestHttpError } from '../exceptions/server.exception';
import { IJwtPayload } from '../jwt/i-jwt-payload';
import { getReqMetadataLite, parseAuthHeader } from '../utils/core.utils';

@Injectable()
export class AttachAuthenticationHttpMiddleware implements NestMiddleware {
  private static BEARER_AUTH_SCHEME = 'bearer';
  private static AUTH_HEADER = 'authorization';

  private verifyOptions: VerifyOptions;

  constructor(
    private readonly bffLoggerService: LoggerSharedService,
    @Inject(AppSharedProviderTokens.Config.App)
    private readonly nestjsBffConfig: INestjsBffConfig,
    private readonly accessPermissionsRepo: AccessPermissionsRepo,
  ) {
    this.verifyOptions = {
      issuer: nestjsBffConfig.jwt.issuer,
      audience: nestjsBffConfig.http.bffRootUrl,
      algorithms: [nestjsBffConfig.jwt.signingAlgorithm],
    };
  }

  public async resolve(context: string): Promise<MiddlewareFunction> {
    return async (req, res, next) => {
      try {
        this.bffLoggerService.trace('-- JwtMiddleware.resolve', {
          'req.originalUrl': req ? req.originalUrl : 'null',
        });
        await this.process(req);
      } catch (error) {
        this.bffLoggerService.error('JwtMiddleware Error', error);
        if (next) next(error);
      }

      if (next) next();
    };
  }

  private async process(req: any): Promise<void> {
    if (!req || !req.originalUrl) {
      this.bffLoggerService.debug('req.originalUrl is null', getReqMetadataLite(req));
      return;
    }

    if (this.nestjsBffConfig.http.publicRouteRegex.test(req.originalUrl)) {
      this.bffLoggerService.debug(`Public URL: ${req.originalUrl}`);
      return;
    }

    return this.attachAuthenticatedUserToRequest(req);
  }

  /**
   *
   *
   * @private
   * @param {*} req
   * @returns {Promise<void>}
   * @memberof JwtMiddleware
   */
  private async attachAuthenticatedUserToRequest(req): Promise<void> {
    const jwtToken = this.getJwtBearerTokenFromRequestHeader(req);
    if (!jwtToken) return;

    const jwtPayload = verify(jwtToken, this.nestjsBffConfig.jwt.jwtPublicKey, this.verifyOptions) as IJwtPayload;
    if (!jwtPayload) throw new BadRequestHttpError('Invalid JWT token', getReqMetadataLite(req));

    let accessPermissionsEntity: AccessPermissionsEntity;
    try {
      accessPermissionsEntity = await this.accessPermissionsRepo.findById(jwtPayload.sub, { skipAuthorization: true });
    } catch (error) {
      throw new BadRequestHttpError(`No authentication data found for request: ${req.originalUrl}, jwtPayload: ${JSON.stringify(jwtPayload)}`, error);
    }

    // this.bffLoggerService.debug(`Attaching authorization to request`, {
    //   'req.originalUrl': req.originalUrl,
    //   accessPermissionsEntity,
    //   'org': accessPermissionsEntity.organizations,
    // });
    req.accessPermissions = accessPermissionsEntity;
  }

  /**
   *
   *
   * @private
   * @param {*} req
   * @returns {(string | undefined)}
   * @memberof JwtMiddleware
   */
  private getJwtBearerTokenFromRequestHeader(req): string | undefined {
    const authHdr = req.headers[AttachAuthenticationHttpMiddleware.AUTH_HEADER];

    if (!authHdr) {
      // log if authHdr not found
      this.bffLoggerService.debug(`No auth header found for request: ${req.originalUrl}`);
      return undefined;
    }

    const parsedAuthHdr = parseAuthHeader(authHdr);
    if (!parsedAuthHdr) {
      throw new BadRequestHttpError(`Malformed auth header found for request: ${req.originalUrl} with authHdr ${authHdr}`, getReqMetadataLite(req));
    }

    if (parsedAuthHdr.scheme !== AttachAuthenticationHttpMiddleware.BEARER_AUTH_SCHEME) {
      throw new BadRequestHttpError(`Incorrect auth scheme. Bearer expected.  Found ${parsedAuthHdr.scheme}`, getReqMetadataLite(req));
    }

    if (!parsedAuthHdr.value) {
      throw new BadRequestHttpError('No auth header value found', getReqMetadataLite(req));
    }

    return parsedAuthHdr.value;
  }
}
