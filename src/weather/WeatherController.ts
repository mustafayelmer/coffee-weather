import {Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post} from '@nestjs/common';
import {WeatherService} from "./WeatherService";
import {WeatherEntity} from "./WeatherSchema";
import {CityBase, DeleteResponse, ErrorResponse} from "@yelmer-samples/coffee-shared";
import {ApiOperation, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";

@Controller('weathers')
@ApiSecurity('apiKey')
@ApiTags('Weather - M2M')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {
    }

    @Post()
    @ApiOperation({ description: 'Fetches latest weather by given city and adds it if weather was not already existed, it is used by city-microservice' })
    @ApiResponse({status: HttpStatus.OK, description: 'OK', type: WeatherEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'UnauthorizedError', type: ErrorResponse})
    @ApiResponse({status: HttpStatus.FAILED_DEPENDENCY, description: 'WeatherProviderError', type: ErrorResponse})
    @ApiResponse({status: HttpStatus.NOT_ACCEPTABLE, description: 'InvalidCityIdError', type: ErrorResponse})
    async createAsync(@Body() city: CityBase): Promise<WeatherEntity> {
        return await this.weatherService.createAsync(city);
    }

    @Delete(':cityId')
    @ApiOperation({ description: 'Deletes all weather info of given city, it is used by city-microservice' })
    @ApiResponse({status: HttpStatus.OK, description: 'OK', type: DeleteResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'UnauthorizedError', type: ErrorResponse})
    @ApiResponse({status: HttpStatus.NOT_ACCEPTABLE, description: 'InvalidCityIdError', type: ErrorResponse})
    async deleteByCityAsync(@Param('cityId', ParseUUIDPipe) cityId: string): Promise<DeleteResponse> {
        return this.weatherService.deleteByCityAsync(cityId);
    }

    @Get(':cityId/last')
    @ApiOperation({ description: 'Fetches latest weather info of given city, it is used by city-microservice' })
    @ApiResponse({status: HttpStatus.OK, description: 'OK', type: WeatherEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'UnauthorizedError', type: ErrorResponse})
    @ApiResponse({status: HttpStatus.NOT_ACCEPTABLE, description: 'InvalidCityIdError', type: ErrorResponse})
    async findLastAsync(@Param('cityId', ParseUUIDPipe) cityId: string): Promise<WeatherEntity> {
        return this.weatherService.findLastAsync(cityId);
    }

    @Get(':cityId/history/:id')
    @ApiOperation({ description: 'Fetches historical weather info of given city except latest weather, it is used by city-microservice' })
    @ApiResponse({status: HttpStatus.OK, description: 'OK', type: WeatherEntity, isArray: true})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'UnauthorizedError', type: ErrorResponse})
    @ApiResponse({
        status: HttpStatus.NOT_ACCEPTABLE,
        description: 'InvalidCityIdError|InvalidWeatherIdError',
        type: ErrorResponse
    })
    async historyAsync(@Param('cityId', ParseUUIDPipe) cityId: string, @Param('id', ParseUUIDPipe) id: string): Promise<Array<WeatherEntity>> {
        return this.weatherService.historyAsync(cityId, id);
    }

    @Post('latest-list')
    @ApiOperation({ description: 'Fetches latest weather info of given cities, it is used by city-microservice' })
    @ApiResponse({status: HttpStatus.OK, description: 'OK', type: WeatherEntity, isArray: true})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: 'UnauthorizedError', type: ErrorResponse})
    @ApiResponse({status: HttpStatus.NOT_ACCEPTABLE, description: 'InvalidCityIdError', type: ErrorResponse})
    async findLastListAsync(@Body() cityIds: Array<string>): Promise<Array<WeatherEntity>> {
        return await this.weatherService.findLastListAsync(cityIds);
    }

}