import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { Encrypter } from '../../modules/common/encryption/encryption.service';
import { LOG_API_KEY } from '../../modules/common/constants';

@Injectable()
export class IsLogCallerAuthorized implements CanActivate {
  constructor(private readonly encrypter: Encrypter) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const logApiKey = request.headers['x-log-api-key'];
    if (logApiKey && this.encrypter.verifyValue(LOG_API_KEY, logApiKey)) {
      return true;
    }
    throw new UnauthorizedException("You don't have access to perform such function");
  }
}
