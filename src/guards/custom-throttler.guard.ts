import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
    const result = await super.handleRequest(requestProps);
    
    const response = requestProps.context.switchToHttp().getResponse();
    response.removeHeader('x-ratelimit-limit');
    response.removeHeader('x-ratelimit-remaining');
    response.removeHeader('x-ratelimit-reset');

    return result;
  }
}