import * as dotenv from "dotenv";
dotenv.config();

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import {AppModule} from "./AppModule";
import {Scheduler} from "./cron/Scheduler";
import helmet from 'helmet';
import {HttpExceptionFilter, NotFoundExceptionFilter} from "@yelmer-samples/coffee-shared";

const port = process.env.HTTP_PORT ?? 8091;
const bootstrap = async () => {
    const app = await NestFactory.create(AppModule, {cors: true, bodyParser: true});
    app.enableCors();
    app.use(helmet());
    app.setGlobalPrefix('v1');
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalFilters(new NotFoundExceptionFilter());

    const npmPackage = process.env.npm_package_name ?? 'coffee-weather';
    const npmVersion = process.env.npm_package_version ?? '1.0.1';
    const options = new DocumentBuilder()
        .setTitle(`${npmPackage}@${npmVersion}`)
        .setDescription('Coffee IT - Weather Microservice')
        .setVersion('1.0')
        .addApiKey({type: 'apiKey', in: 'header', name: 'x-api-key'}, 'apiKey')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document);
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    Scheduler.initialize();
}
bootstrap().then();
