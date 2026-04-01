import { ContextIdFactory, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createDatabaseIfNotExists } from './db/utils/db-utils';
import { AggregateByTenantContextIdStrategy } from './modules/saasLayer/context/multi-tenancy-context.provider';

async function bootstrap() {
  const PORT = process.env.PORT || 8000;
  await createDatabaseIfNotExists(process.env.DATABASE_NAME);
  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true
    })
  );
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
  let config = new DocumentBuilder()
    .setTitle('Multi-Tenant SaaS Boilerplate')
    .setDescription('The Multi-Tenant SaaS Boilerplate description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-swagger', app, document);
  await app.listen(PORT);
}
bootstrap();
