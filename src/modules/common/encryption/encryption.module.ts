import { Global, Module } from '@nestjs/common';
import { Encrypter } from './encryption.service';

@Global()
@Module({
  providers: [
    {
      provide: Encrypter,
      useValue: Encrypter.getInstance()
    }
  ],
  exports: [Encrypter]
})
export class EncrypterModule {}
