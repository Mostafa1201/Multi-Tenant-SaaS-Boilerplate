import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateTenantSettingsDto {
  @ApiProperty({ type: String, description: 'Environment key', required: true })
  @IsNotEmpty()
  key: string;

  @ApiProperty({ type: String, description: 'Environment value', required: true })
  @IsNotEmpty()
  value: string;
}
