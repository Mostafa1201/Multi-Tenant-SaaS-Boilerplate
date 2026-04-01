import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TIME_IN_MILLISECONDS } from './modules/common/constants';
import { TenantModule } from './modules/core/tenant/tenant.module';
import { LoggerModule } from './logger/logger.module';
import { SaasModule } from './modules/saasLayer/saas/saas.module';
import { SettingsModule } from './modules/core/tenant/settings/settings.module';
import { EncrypterModule } from './modules/common/encryption/encryption.module';
import { TenantListDataModule } from './modules/core/tenant/tenant-list-data/tenant-list-data.module';
import { CoreModule } from './modules/core/core.module';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './guards/custom-throttler.guard';
import { AppAuthGuard } from './guards/app-auth.guard';
import { TenantAuthGuard } from './guards/tenant-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1 * TIME_IN_MILLISECONDS,
        limit: 80
      }
    ]),
    TenantModule,
    LoggerModule,
    SaasModule,
    SettingsModule,
    EncrypterModule,
    TenantListDataModule,
    CoreModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: AppAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: TenantAuthGuard
    }
  ]
})
export class AppModule {}
