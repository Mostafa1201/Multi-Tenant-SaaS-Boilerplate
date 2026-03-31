import { PartialType } from '@nestjs/swagger';
import { CreateTenantDbCredentialsDto } from './create-tenant-credentials.dto';

export class UpdateTenantCredentialsDto extends PartialType(CreateTenantDbCredentialsDto) {}
