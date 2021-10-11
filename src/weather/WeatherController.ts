import {Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post} from '@nestjs/common';
import {WeatherService} from "./WeatherService";
import {WeatherEntity} from "./WeatherSchema";
import {City, DeleteResponse, ErrorResponse} from "@yelmer-samples/coffee-shared";
import {ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";

@Controller('weathers')
@ApiSecurity('apiKey')
@ApiTags('Weather - M2M')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {
    }

    @Post()
    @ApiResponse({status: HttpStatus.OK, description: 'OK', type: WeatherEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'UnauthorizedError', type: ErrorResponse})
    @ApiResponse({status: HttpStatus.FAILED_DEPENDENCY, description: 'WeatherProviderError', type: ErrorResponse})
    @ApiResponse({status: HttpStatus.NOT_ACCEPTABLE, description: 'InvalidCityIdError', type: ErrorResponse})
    async create(@Body() city: City): Promise<WeatherEntity> {
        return await this.weatherService.createAsync(city);
    }

    @Delete(':cityId')
    @ApiResponse({status: HttpStatus.OK, description: 'OK', type: DeleteResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'UnauthorizedError', type: ErrorResponse})
    @ApiResponse({status: HttpStatus.NOT_ACCEPTABLE, description: 'InvalidCityIdError', type: ErrorResponse})
    async delete(@Param('cityId', ParseUUIDPipe) cityId: string): Promise<DeleteResponse> {
        return this.weatherService.deleteByCityAsync(cityId);
    }

    @Get(':cityId/last')
    @ApiResponse({status: HttpStatus.OK, description: 'OK', type: WeatherEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'UnauthorizedError', type: ErrorResponse})
    @ApiResponse({status: HttpStatus.NOT_ACCEPTABLE, description: 'InvalidCityIdError', type: ErrorResponse})
    async findLast(@Param('cityId', ParseUUIDPipe) cityId: string): Promise<WeatherEntity> {
        return this.weatherService.findLastAsync(cityId);
    }

    @Get(':cityId/history/:id')
    @ApiResponse({status: HttpStatus.OK, description: 'OK', type: WeatherEntity, isArray: true})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'UnauthorizedError', type: ErrorResponse})
    @ApiResponse({
        status: HttpStatus.NOT_ACCEPTABLE,
        description: 'InvalidCityIdError|InvalidWeatherIdError',
        type: ErrorResponse
    })
    async history(@Param('cityId', ParseUUIDPipe) cityId: string, @Param('id', ParseUUIDPipe) id: string): Promise<Array<WeatherEntity>> {
        return this.weatherService.historyAsync(cityId, id);
    }

    @Post('latest-list')
    @ApiResponse({status: HttpStatus.OK, description: 'OK', type: WeatherEntity, isArray: true})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'UnauthorizedError', type: ErrorResponse})
    @ApiResponse({status: HttpStatus.NOT_ACCEPTABLE, description: 'InvalidCityIdError', type: ErrorResponse})
    async latestList(@Body() cityIds: Array<string>): Promise<Array<WeatherEntity>> {
        return await this.weatherService.findLastListAsync(cityIds);
    }

}