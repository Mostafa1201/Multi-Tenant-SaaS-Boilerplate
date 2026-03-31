import { PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';

export class UpdateTenantDataDto extends PartialType(CreateTenantDto) {}
