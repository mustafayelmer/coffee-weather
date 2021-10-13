import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {SecurityMiddleware} from "./security/SecurityMiddleware";
import {WeatherModule} from "./weather/WeatherModule";
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_CONNECTION),
        ScheduleModule.forRoot(),
        WeatherModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SecurityMiddleware)
            .forRoutes('weathers');
    }
}