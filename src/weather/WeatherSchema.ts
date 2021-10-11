import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {Weather, WeatherRoot} from "@yelmer-samples/coffee-shared";
import {ApiProperty} from "@nestjs/swagger";

@Schema({collection: 'weather'})
export class WeatherEntity implements Weather {

    @Prop()
    @ApiProperty({description: 'Weather id', type: String, format: 'uuid'})
    id: string;

    @Prop()
    @ApiProperty({description: 'City id', type: String, format: 'uuid'})
    city: string;

    @Prop()
    @ApiProperty({description: 'Calculated at', type: String})
    calculatedAt: string;

    @Prop()
    @ApiProperty({description: 'Latest data', type: WeatherRoot})
    doc: WeatherRoot;
}

export const WeatherSchema = SchemaFactory.createForClass(WeatherEntity);
export type WeatherDocument = WeatherEntity & Document;
