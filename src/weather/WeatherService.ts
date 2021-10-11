import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import * as uuid from 'uuid';
import * as querystring from 'querystring';
import axios, {AxiosResponse} from "axios";
import {WeatherDocument, WeatherEntity} from "./WeatherSchema";
import {City, DeleteResponse, WeatherRoot} from "@yelmer-samples/coffee-shared";
import {WeatherProviderError} from "./error/WeatherProviderError";
import {InvalidCityIdError} from "./error/InvalidCityIdError";
import {InvalidWeatherIdError} from "./error/InvalidWeatherIdError";
import {CityService} from "../city/CityService";

@Injectable()
export class WeatherService {
    private static _INS: WeatherService;
    static readonly OWM_URL = 'https://api.openweathermap.org/data/2.5/weather';
    static readonly REQUIRED_PROPS: Array<string> = ['dt', 'id', 'name'];

    constructor(
        @InjectModel(WeatherEntity.name) private readonly weatherModel: Model<WeatherDocument>,
    ) {
        WeatherService._INS = this;
    }
    static get INS(): WeatherService {
        return this._INS;
    }

    private static _minAgedTime(): Date {
        return new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
    }

    private static async _fetchAsync(name: string): Promise<WeatherRoot> {
        let content: AxiosResponse<WeatherRoot> = null;
        const query = querystring.stringify({
            q: name,
            appid: process.env.OWM_API_KEY,
            units: 'metric',
            lang: 'en',
        });
        try {
            content = await axios.get<WeatherRoot>(`${WeatherService.OWM_URL}?${query}`);
        } catch (e) {
            throw new WeatherProviderError(name, e?.message ?? 'Unknown error');
        }
        if (!content?.data) {
            throw new WeatherProviderError(name, 'Content not found');
        }
        const data = content.data;
        for (const prop of WeatherService.REQUIRED_PROPS) {
            if ([null, undefined].includes(data[prop])) {
                throw new WeatherProviderError(name, `Property[${prop}] not found`);
            }
        }
        return data;
    }
    async fetchAllCities(): Promise<number> {
        let count = 0;
        const cities = await CityService.listBasicAsync();
        if (Array.isArray(cities)) {
            for (const city of cities) {
                try {
                    await this.createAsync(city);
                    count++;
                } catch (e) {
                    console.log(e);
                }
            }
        }
        return count;
    }
    async createAsync(city: City): Promise<WeatherEntity> {
        if (typeof city !== 'object' || Array.isArray(city) || !city) {
            throw new InvalidCityIdError(null);
        }
        if (!uuid.validate(city.id)) {
            throw new InvalidCityIdError(city.id ?? null);
        }
        await this.clearAgedAsync(city);
        const entity = new WeatherEntity();
        entity.id = uuid.v4();
        entity.city = city.id;
        entity.doc = null;
        entity.calculatedAt = null;
        const old = await this.findLastAsync(city.id);
        const fetched = await WeatherService._fetchAsync(city.name);
        if (old?.doc?.dt !== fetched?.dt) {
            entity.doc = fetched;
            entity.calculatedAt = (new Date(fetched.dt * 1000)).toISOString();
            const createdCity = new this.weatherModel(entity);
            await createdCity.save();
        } else {
            entity.calculatedAt = old?.calculatedAt ?? null;
            console.log(`[${city.name}] - Ignored weather because is same`);
        }
        return entity;
    }

    async deleteByCityAsync(cityId: string): Promise<DeleteResponse> {
        if (!uuid.validate(cityId)) {
            throw new InvalidCityIdError(cityId ?? null);
        }
        await this.weatherModel.deleteMany({city: cityId});
        return {id: cityId};
    }

    async findLastAsync(cityId: string): Promise<WeatherEntity> {
        if (!uuid.validate(cityId)) {
            throw new InvalidCityIdError(cityId ?? null);
        }
        return this.weatherModel.findOne({city: cityId}).sort({calculatedAt: 1});
    }
    async findLastListAsync(cityIds: Array<string>): Promise<Array<WeatherEntity>> {
        const list: Array<WeatherEntity> = [];
        for (const cityId of cityIds) {
            list.push(await this.findLastAsync(cityId));
        }
        return list;
    }

    async historyAsync(cityId: string, id: string): Promise<Array<WeatherEntity>> {
        if (!uuid.validate(cityId)) {
            throw new InvalidCityIdError(cityId ?? null);
        }
        if (!uuid.validate(id)) {
            throw new InvalidWeatherIdError(id ?? null);
        }
        return this.weatherModel.find({
            city: cityId,
            id: { $ne: id },
            calculatedAt: {
                $gte: WeatherService._minAgedTime().toISOString()
            }
        }).sort({calculatedAt: 1}).limit(100);
    }

    async clearAgedAsync(city: City): Promise<void> {
        try {
            await this.weatherModel.deleteMany({
                city: city.id,
                calculatedAt: {
                    $lt: WeatherService._minAgedTime().toISOString()
                }
            });
        } catch (e) {
            console.log(e.message);
        }
        return null;
    }
}