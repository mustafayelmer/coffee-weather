import {HttpException, HttpStatus} from "@nestjs/common";

export class InvalidWeatherIdError extends HttpException {
    constructor(id: unknown) {
        super(`Weather id is not valid with value: ${JSON.stringify(id)}!`, HttpStatus.NOT_ACCEPTABLE);
    }
}