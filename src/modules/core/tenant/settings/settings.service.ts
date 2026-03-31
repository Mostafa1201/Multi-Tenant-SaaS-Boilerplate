import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Settings } from './entities/settings.entity';
import { Encrypter } from '../../../common/encryption/encryption.service';
@Injectable()
export class SettingsService {
  constructor(private readonly encrypter: Encrypter) {}
}
