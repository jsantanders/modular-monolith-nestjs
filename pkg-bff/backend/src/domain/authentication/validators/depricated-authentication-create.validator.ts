import { Injectable } from '@nestjs/common';
import { ValidationError } from '../../../shared/exceptions/validation.exception';
import { AuthenticationEntity } from '../model/authentication.entity';
import { AuthenticationRepo } from '../repo/authentication.repo';
import { Messages } from './messages.constants';

export interface IAuthenticationCreateValidatorOptions {
  skipUserIdValidation: boolean;
}
@Injectable()
export class DeprecatedAuthenticationCreateValidator {
  constructor(private readonly authenticationRepo: AuthenticationRepo) {}

  public async validate(authenticationEntity: AuthenticationEntity, options?: IAuthenticationCreateValidatorOptions) {
    const messages: string[] = [];

    if (!options || !options.skipUserIdValidation) {
      if (!authenticationEntity.userId) messages.push(Messages.USER_ID_REQUIRED);
    }

    if (authenticationEntity.local) {
      if (await this.authenticationRepo.findOne({ local: { email: authenticationEntity.local.email } })) {
        messages.push(Messages.EMAIL_IN_USE);
      }
    }

    if (messages.length > 0) throw new ValidationError(messages);
  }
}
