import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './access-control/common/filters/exception.filter';
import { TimeoutInterceptor } from './access-control/common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  const configService = app.get(ConfigService);
  const environment = configService.get('NODE_ENV');
  const port = configService.get('PORT') || 3000;
  const cors = configService.get('CORS') === 'true';
  if (cors) {
    app.enableCors();
  }
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.setGlobalPrefix('api/v1');

  if (environment === 'develop') {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('Endpoints - API - Gateway')
      .addBearerAuth()
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document, {
      swaggerOptions: {
        filter: true,
        persistAuthorization: true,
      },
    });
  }

  await app.listen(port, () => {
    logger.verbose(`CORS Enabled: ${cors}`);
    logger.verbose(`Server on port: ${port}`);
  });
}
bootstrap();
