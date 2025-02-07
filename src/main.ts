import 'dotenv/config';
import graphQLUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { FileInterceptorMegaBytes } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/graphql',
    graphQLUploadExpress({
      maxFileSize:
        Number(process.env.MAX_FILE_SIZE_MEGABYTES) * FileInterceptorMegaBytes,
      maxFiles: Number(process.env.MAX_NUMBER_OF_FILES),
    }),
  );

  app.enableCors({
    origin: 'http://localhost:8081',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
