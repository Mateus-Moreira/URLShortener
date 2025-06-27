/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.USERS_API_PORT || 3001;
  await app.listen(port);
Logger.log(
  `🚀 Application is running on: ${process.env.USERS_API_BASE_URL || `http://localhost:${port}/${globalPrefix}`}`
);
}

bootstrap();
