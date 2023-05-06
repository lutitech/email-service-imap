import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
  .setTitle('Email Service API')
  .setDescription('Email Service API')
  .setVersion('1.0')
  .addTag('Email Service API')
  .build();

const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  })
}
bootstrap();
