import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './configuration/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  initializeSwagger(app);

  const appConfigService = app.get<AppConfigService>(AppConfigService);
  const port = appConfigService.getAppPort();

  await app.listen(port);
  console.log(`Application is running on: ${port}`);
}

function initializeSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Mini Bank')
    .setDescription('Bank API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
