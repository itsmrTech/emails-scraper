import { config } from 'dotenv-safe';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    // Paths you want to protect with basic auth
    '/docs*',
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  // Swagger configuration
  const options = new DocumentBuilder()
    .setTitle('FETCH EMAILS APIS')
    .setDescription(
      'The Fetch Emails API description made for the HappyScribe Interview',
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      in: 'docs',
      name: 'Authorization',
      bearerFormat: 'jwt',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
