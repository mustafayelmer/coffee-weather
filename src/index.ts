import * as dotenv from "dotenv";
dotenv.config();

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import {AppModule} from "./AppModule";
import helmet from 'helmet';
import {HttpExceptionFilter, NotFoundExceptionFilter} from "@yelmer-samples/coffee-shared";
import {Logger} from "@nestjs/common";

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
    const logger = new Logger('index');
    logger.log(`-----------------------`);
    logger.log(`Application is started`);
}
bootstrap().then();
