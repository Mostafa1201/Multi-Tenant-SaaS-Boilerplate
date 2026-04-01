import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { Encrypter } from '../../modules/common/encryption/encryption.service';
import { DEBUG_API_KEY } from '../../modules/common/constants';

@Injectable()
export class IsDebuggerAuthorized implements CanActivate {
  constructor(private readonly encrypter: Encrypter) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const debugApiKey = request.headers['x-debug-api-key'];
    if (debugApiKey && this.encrypter.verifyValue(DEBUG_API_KEY, debugApiKey)) {
      return true;
    }
    throw new UnauthorizedException("You don't have access to perform such function");
  }
}
