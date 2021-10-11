# coffee-weather

Coffee Project > Weather microservice

## Standards
- Language: `TS`
- Eslint: `Yes`
- Static Code Analysis: `Yes` *IntelliJ Code Inspections*
- DDD - Document Driven: `Yes`
- DDD - Domain Driven: `Yes`
- EDD - Exception Driven: `Yes`
- TDD - Test Driven: `Yes` [go to test folder](./test/)
- LDD - Log Driven: `No`
- 12FA - 12 Factor-App: `50%` *Partially*

## Commands
- ``npm run clear`` *// clears "dist" folder*
- ``npm run lint`` *// runs eslint for static code analysis*
- ``npm run test`` *// runs test files in "test" folder*
- ``npm run build`` *// builds JS files at "dist" folder*
- ``npm run test`` *// run tests*
- ``npm run start`` *// starts web server*

## Dependencies
- ``@nestjs/common`` *core nestjs utilities*
- ``@nestjs/core`` *core nestjs component*
- ``@nestjs/mongoose`` *core mongodb client*
- ``@nestjs/platform-express`` *core express component*
- ``@nestjs/swagger`` *core open-api component*
- ``@nestjs/testing`` *core test component*
- ``@yelmer-samples/coffee-shared`` *shared project data models*
- ``axios`` *http request*
- ``cron`` *to initialize cron jobs*
- ``dotenv`` *to read environment*
- ``mongoose`` *mongodb client*
- ``reflect-metadata`` *reflection*
- ``rimraf`` *clears dist*
- ``rxjs`` *handles header keys*
- ``swagger-ui-express`` *swagger ui*
- ``uuid`` *to generate uuid*

## Postman
> At environment panel, you should set {{host}} and {{apiKey}}
>
- `host` : `http://localhost:8091/`
- `apiKey` : `3de4ad39-0977-467f-8e07-70b3f3e4ebd3` - *to basic M2M security* 
- [Postman Collection Export](./assets/coffee-weather.postman_collection.json)
- [Postman Environment Export](./assets/coffee-weather.postman_environment.json)

## OpenAPI
> All endpoints, dto(models) and entities are documented
> Authentication (ApiKey style) was implemented
>
- [OpenAPI Interface / Swagger UI](http://localhost:8091/docs)
- `apiKey` : click security and fill it as `3de4ad39-0977-467f-8e07-70b3f3e4ebd3`

## Endpoints

### Fetch a weather info for city
| Type | Value |
| ---- | --- |
| Endpoint | POST `host`/v1 |
| Header | `apiKey` |
| Payload | [City](#city) |
| Response | [Weather](#weather) |

### Delete all weather info of city
| Type | Value |
| ---- | --- |
| Endpoint | DELETE `host`/v1/:cityId |
| Header | `apiKey` |
| Response | [Weather](#city) |

### Get last weather info of city
| Type | Value |
| ---- | --- |
| Endpoint | GET `host`/v1/:cityId |
| Header | `apiKey` |
| Response | [Weather](#weather) |

## Models

### City
````typescript
export interface City {
    id: string;
    name: string;
}
````

### Weather
````typescript
export interface Weather {
    id: string;
    city: string;
    calculatedAt: string|Date;
    doc: WeatherRoot;
}
````

---
### Prepared by
- Mustafa Yelmer
- mustafayelmer(at)gmail.com
- `2021-09-27`