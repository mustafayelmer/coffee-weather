import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {WeatherEntity, WeatherSchema} from "./WeatherSchema";
import {WeatherController} from "./WeatherController";
import {WeatherService} from "./WeatherService";

@Module({
    imports: [MongooseModule.forFeature([{ name: WeatherEntity.name, schema: WeatherSchema }])],
    controllers: [WeatherController],
    providers: [WeatherService],
})
export class WeatherModule {}