import {HttpException, HttpStatus} from "@nestjs/common";

export class WeatherProviderError extends HttpException {
    constructor(name: string, message: string) {
        super(`[City: ${name}] => ${message}`, HttpStatus.FAILED_DEPENDENCY);
    }
}