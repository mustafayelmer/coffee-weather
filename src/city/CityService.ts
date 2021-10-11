import axios, {AxiosResponse} from "axios";
import {CityBase} from "@yelmer-samples/coffee-shared";
import {CityProviderError} from "./error/CityProviderError";

type AxiosLambda<T> = () => Promise<AxiosResponse<T>>;

// noinspection JSUnusedGlobalSymbols
export class CityService {
    static readonly URL = 'http://city:8090/v1/cities';

    private static get _header(): Record<string, string> {
        return {
            'x-api-key': process.env.CITY_API_KEY,
        }
    }

    private static async _runAsync<T>(name: string, fnc: AxiosLambda<T>): Promise<T> {
        let content: AxiosResponse<T> = null;
        try {
            content = await fnc();
        } catch (e) {
            throw new CityProviderError(name, e?.message ?? 'Unknown error');
        }
        if (!content?.data) {
            throw new CityProviderError(name, 'Content not found');
        }
        return content.data;

    }

    static async listBasicAsync(): Promise<Array<CityBase>> {
        return await this._runAsync<Array<CityBase>>('m2m/list', async () => {
            return await axios.get(`${this.URL}/m2m/list`, {headers: this._header});
        });
    }

    static async getByIdAsync(cityId: string): Promise<CityBase> {
        return await this._runAsync<CityBase>('m2m/:id', async () => {
            return await axios.get(`${this.URL}/m2m/${cityId}`, {headers: this._header});
        });
    }
}