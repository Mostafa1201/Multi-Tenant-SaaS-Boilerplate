import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { IsMasterTenant } from '../../../decorators/master-tenant.decorator';
import { IsPublic } from '../../../decorators/public.decorator';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @IsMasterTenant()
  @IsPublic()
  @ApiOperation({ summary: 'get all tenants inside the masterDb' })
  @Get()
  async getTenants() {
    return await this.tenantService.getAllTenants();
  }

  @ApiExcludeEndpoint()
  @IsPublic()
  @ApiOperation({ summary: 'get all tenant settings' })
  @ApiHeader({ name: 'tenant', description: 'tenant name/code' })
  @Get('/settings')
  async getAllTenantSettings(): Promise<any> {
    return this.tenantService.getAllTenantSettings();
  }
}
