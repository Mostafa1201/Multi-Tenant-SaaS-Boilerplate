import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTenantDbCredentialsDto {
  @ApiProperty({ type: String, description: 'Tenant Database Host', required: true })
  @IsNotEmpty()
  host: string;

  @ApiProperty({ type: String, description: 'Tenant Database Port', required: true })
  @IsNotEmpty()
  @IsString()
  port: string;

  @ApiProperty({ type: String, description: 'Tenant Database Name', required: true })
  @IsNotEmpty()
  database: string;

  @ApiProperty({ type: String, description: 'Tenant Database Username', required: true })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String, description: 'Tenant Database Password', required: true })
  @IsNotEmpty()
  password: string;
}
