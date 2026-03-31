import { SetMetadata } from '@nestjs/common';
export const IsMasterTenant = () => SetMetadata('isMasterTenant', true);