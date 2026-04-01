import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TenantAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const isMasterTenant = this.reflector.get<boolean>('isMasterTenant', context.getHandler());

    if (isMasterTenant) {
      return true;
    }
    const tenantId = req.headers['tenant'];
    if (!tenantId) {
      throw new UnauthorizedException('No tenant id found');
    }
    return true;
  }
}
