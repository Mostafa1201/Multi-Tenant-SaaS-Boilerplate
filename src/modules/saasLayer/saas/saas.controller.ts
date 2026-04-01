import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SaasService } from './saas.service';
import { UpdateTenantDto } from './dtos/update-tenant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsMasterTenant } from '../../../decorators/master-tenant.decorator';
import { IsPublic } from '../../../decorators/public.decorator';
import { CreateTenantDto } from '../../core/tenant/dtos/create-tenant.dto';
import { UpdateTenantDataDto } from '../../core/tenant/dtos/update-tenant.dto';

@ApiTags('Saas')
@Controller('saas')
export class SaasController {
  constructor(private readonly saasService: SaasService) {}

  @Post('pilot')
  @IsMasterTenant()
  @IsPublic()
  async createPilot(@Body() createTenantDto: CreateTenantDto) {
    await this.saasService.createPilot(createTenantDto);
    return true;
  }

  @Put('pilot')
  @IsMasterTenant()
  @IsPublic()
  async updatePilot(@Body() body: UpdateTenantDataDto) {
    await this.saasService.updatePilot(body);
    return true;
  }

  @Delete('pilot/:tenantId')
  @IsMasterTenant()
  @IsPublic()
  async deletePilot(@Param('tenantId') tenantId: string) {
    await this.saasService.deletePilot(tenantId);
    return true;
  }

  @Get('pilot/credentials')
  @IsPublic()
  async getTenantCredentials() {
    return await this.saasService.getTenantDbCredentials();
  }

  @Post('environment')
  @IsMasterTenant()
  @IsPublic()
  async createEnvironmentVariables(@Body() dataDto: UpdateTenantDto) {
    try {
      const data = await this.saasService.createEnvironment(dataDto.code, dataDto.environment);
      return { data };
    } catch (error) {
      console.log('error: ', error);
    }
  }

  @IsMasterTenant()
  @IsPublic()
  @ApiOperation({ summary: 'upload tenant logo' })
  @Post('logo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['logo'],
      properties: {
        logo: {
          type: 'file',
          format: 'binary'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('logo'))
  async uploadTenantLogo(@Req() req: Request, @UploadedFile() logo: Express.Multer.File): Promise<any> {
    const tenant = req.headers['tenant'];
    if (!tenant) throw new NotFoundException('please provide tenant value to the header');
    if (!logo) throw new NotFoundException('uploaded image not provided');
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = logo.originalname.substring(logo.originalname.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension?.toLowerCase())) {
      throw new BadRequestException('Only [.jpg,.jpeg,.png] images are allowed');
    }
    return await this.saasService.uploadTenantLogo(logo);
  }

  @IsMasterTenant()
  @IsPublic()
  @ApiOperation({ summary: 'upload template logo' })
  @Post('template')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['template'],
      properties: {
        logo: {
          type: 'file',
          format: 'binary'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('template'))
  async uploadTemplateLogo(@Req() req: Request, @UploadedFile() template: Express.Multer.File): Promise<any> {
    const tenant = req.headers['tenant'];
    if (!tenant) throw new NotFoundException('please provide tenant value to the header');
    if (!template) throw new NotFoundException('uploaded image not provided');
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = template.originalname.substring(template.originalname.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension?.toLowerCase())) {
      throw new BadRequestException('Only [.jpg,.jpeg,.png] images are allowed');
    }
    return await this.saasService.uploadTemplateLogo(template);
  }
}
