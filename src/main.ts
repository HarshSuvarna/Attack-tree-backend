import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('AT-backend')
    .setDescription('APIs for Attack Tree website application')
    .setVersion('1.0')
    .addTag('APIs')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser()); //to get cookies in request

  app.enableCors({
    credentials: true,
    methods: ['OPTIONS', 'GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    exposedHeaders: ['Set-cookie'],
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:5173',
      'https://attack-tree-tool-frontend.onrender.com',
    ],
  });
  await app.listen(8080);
}
bootstrap();
