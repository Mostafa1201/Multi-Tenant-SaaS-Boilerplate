import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTenantDbCredentialsDto } from '../tenant-credentials/dtos/create-tenant-credentials.dto';

export class CreateTenantDto {
  @ApiProperty({ type: String, description: 'Tenant Code', required: true })
  @IsNotEmpty()
  tenantCode: string;

  @ApiProperty({ type: String, description: 'Tenant Name', required: true })
  @IsNotEmpty()
  tenantName: string;

  @ApiProperty({ type: CreateTenantDbCredentialsDto, description: 'Tenant Credentials', required: true })
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTenantDbCredentialsDto)
  dbCredentials: CreateTenantDbCredentialsDto;
}
