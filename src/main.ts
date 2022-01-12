import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('ErWin ISLE API')
        .setDescription('The ErWin ISLE API description.')
        .setVersion('0.1')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('swagger', app, document);

    // BUG: this will also set the prefix for the federal api
    // app.setGlobalPrefix('isle');
    await app.listen(3000);
}

bootstrap();
