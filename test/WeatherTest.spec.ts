import {WeatherController} from "../dist/weather/WeatherController";
import {WeatherService} from "../dist/weather/WeatherService";
import {WeatherEntity} from "../src/weather/WeatherSchema";

describe('City', () => {
    let weatherController: WeatherController;
    let weatherService: WeatherService;

    beforeEach(() => {
        weatherController = new WeatherController(weatherService);
    });

    describe('findAll', () => {
        it('should return an array of cats', async () => {
            const result = new WeatherEntity();
            jest.spyOn(weatherService, 'findLastAsync').mockImplementation(async() => result);
            expect(await weatherController.findLast('')).toBe(result);
        });
    });
});