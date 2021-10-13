import * as fs from "fs";
import * as mongoose from "mongoose";
import {WeatherDocument} from "../src/weather/WeatherSchema";
import {WeatherService} from "../src/weather/WeatherService";
import {WeatherController} from "../src/weather/WeatherController";
import {CityBase, DeleteResponse} from "@yelmer-samples/coffee-shared";
import {WeatherEntity} from "../src/weather/WeatherSchema";

const _json = <T>(name: string): T => {
    const raw = fs.readFileSync(__dirname + `/data/${name}.json`);
    return JSON.parse(raw.toString()) as T;
}

/*describe('Application', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/foo-bar')
            .expect(404);
    });
});*/
describe('City', () => {
    let weatherModel: mongoose.Model<WeatherDocument>;
    let weatherService: WeatherService;
    let weatherController: WeatherController;
    let cityId: string;

    beforeEach(async () => {
        weatherModel = {
            find() {
                return {};
            }
        } as mongoose.Model<WeatherDocument>;
        weatherService = new WeatherService(weatherModel);
        weatherController = new WeatherController(weatherService);
        cityId = '465880a5-62d5-447c-9b06-6618a51fc8e1';
    });

    describe('create', () => {
        it('should fetch & insert', async () => {
            const payload = _json<CityBase>('create.in');
            const body = _json<WeatherEntity>('create.out');

            jest.spyOn(weatherService, 'createAsync').mockImplementation(async () => body);
            expect(await weatherController.createAsync(payload)).toBe(body);
        });
    });
    describe('deleteByCity', () => {
        it('should delete all city weathers', async () => {
            const body = {id: cityId} as DeleteResponse;
            jest.spyOn(weatherService, 'deleteByCityAsync').mockImplementation(async () => body);
            expect(await weatherController.deleteByCityAsync(cityId)).toBe(body);
        });
    });

    describe('findLast', () => {
        it('should find the latest weather of city', async () => {
            const body = _json<WeatherEntity>('create.out');

            jest.spyOn(weatherService, 'findLastAsync').mockImplementation(async () => body);
            expect(await weatherController.findLastAsync(cityId)).toBe(body);
        });
    });

    describe('history', () => {
        it('should find the latest weather of city and history data after last 7 days', async () => {
            const body = _json<Array<WeatherEntity>>('history.out');

            jest.spyOn(weatherService, 'historyAsync').mockImplementation(async () => body);
            expect(await weatherController.historyAsync(cityId, '6ea8ee72-fbc4-404e-a00c-deeab6214eef')).toBe(body);
        });
    });

    describe('findLastList', () => {
        it('should find last weathers of given cities in array', async () => {
            const body = _json<Array<WeatherEntity>>('findLastList.out');
            const cities = ["465880a5-62d5-447c-9b06-6618a51fc8e1","8fbb7edc-171f-49db-9325-7f7968e4dcd3"];

            jest.spyOn(weatherService, 'findLastListAsync').mockImplementation(async () => body);
            expect(await weatherController.findLastListAsync(cities)).toBe(body);
        });
    });
});