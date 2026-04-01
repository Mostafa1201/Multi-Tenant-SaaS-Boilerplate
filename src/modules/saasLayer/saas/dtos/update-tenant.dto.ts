import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, ValidateNested } from 'class-validator';
import { UpdateTenantSettingsDto } from './update-tenant-settings.dto';
import { Type } from 'class-transformer';

export class UpdateTenantDto {
  @ApiProperty({ type: String, description: 'Tenant Code', required: true })
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    type: UpdateTenantSettingsDto,
    isArray: true,
    description: 'environment keys and values',
    required: true
  })
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateTenantSettingsDto)
  environment: UpdateTenantSettingsDto[];
}
