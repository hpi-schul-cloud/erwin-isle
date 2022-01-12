import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MainModule } from './main.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(MainModule);
    const config = new DocumentBuilder()
        .setTitle('ErWin ISLE API')
        .setDescription('The ErWin ISLE API description.')
        .setVersion('0.1')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('swagger', app, document);

    await app.listen(3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
