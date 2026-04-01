import { getTenantConstants } from '../../../common/constants';
import { TenantSettings } from '../types/tenant-settings.interface';

export class TenantSettingsManagement {
  private _env: TenantSettings = {};
  private _constants = getTenantConstants(this._env);

  setTenantEnv(settings: TenantSettings) {
    this._env = settings;
  }

  getTenantEnv() {
    return this._env;
  }

  setTenantConstants(constants) {
    this._constants = constants;
  }

  getTenantConstants() {
    return this._constants;
  }
}
