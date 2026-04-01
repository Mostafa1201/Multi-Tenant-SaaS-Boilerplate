import { TenantSettings } from '../core/tenant/types/tenant-settings.interface';

export const TYPEORM_MASTER_PROVIDER = 'TYPEORM_MASTER_PROVIDER';
export const TYPEORM_CLIENT_PROVIDER = 'TYPEORM_CLIENT_PROVIDER';
export const LOGGER_MASTER_PROVIDER = 'LOGGER_MASTER_PROVIDER';
export const LOGGER_CLIENT_PROVIDER = 'LOGGER_CLIENT_PROVIDER';
export const LOG_API_KEY = 'log_api_key';
export const DEBUG_API_KEY = 'debug_api_key';
export const TIME_IN_MILLISECONDS = 1000;
export const TENANTS_DATA_PATH = process.env.TENANTS_DATA_PATH;

export const getTenantConstants = (env: TenantSettings) => {
  const DOMAIN_NAME = env.DOMAIN_NAME;
  return {
    DOMAIN_NAME,
    EXAMPLE_URL: `https://${DOMAIN_NAME}/example`
  };
};
