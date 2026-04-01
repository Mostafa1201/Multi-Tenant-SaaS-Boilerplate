import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { TenantLogger } from './tenant-logger';
@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: TenantLogger,
      useValue: TenantLogger.getInstance()
    },
    LoggerService
  ],
  exports: [TenantLogger, LoggerService],
  controllers: [LoggerController]
})
export class LoggerModule {}
