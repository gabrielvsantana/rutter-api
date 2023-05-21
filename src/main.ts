import 'dotenv/config.js';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { env } from './config/env';
import { AppModule } from './app.module';
import { getSwaggerDocument } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  SwaggerModule.setup('docs', app, getSwaggerDocument(app));
  await app.listen(env.PORT);
}
bootstrap();
