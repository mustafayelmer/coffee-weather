import {HttpException, HttpStatus} from "@nestjs/common";

export class InvalidCityIdError extends HttpException {
    constructor(id: unknown) {
        super(`City id is not valid with value: ${JSON.stringify(id)}!`, HttpStatus.NOT_ACCEPTABLE);
    }
}