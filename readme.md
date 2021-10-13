# coffee-weather

Coffee Project > Weather microservice

## Standards
- Language: `TS`
- Eslint: `Yes`
- Static Code Analysis: `Yes` *IntelliJ Code Inspections*
- DDD - Document Driven: `Yes`
- DDD - Domain Driven: `Yes`
- EDD - Exception Driven: `Yes`
- TDD - Test Driven: `Yes` [unit tests](./test)
- LDD - Log Driven: `Yes`
- 12FA - 12 Factor-App: `50%` *Partially*

## Commands
- `npm run clear` *// clears "dist" folder*
- `npm run lint` *// runs eslint for static code analysis*
- `npm run build` *// builds JS files at "dist" folder*
- `npm run test` *// runs test files in "test" folder*
- `npm run start` *// starts web server*
- `npm run test:watch` *// runs test files in "test" folder*
- `npm run test:coverage` *// runs test files in "test" folder*
- `npm run run:js` *// direct run from dist without build*
- `npm run run:ts` *// direct run from src without build*

## Dependencies
- `@nestjs/common` *core nestjs utilities*
- `@nestjs/core` *core nestjs component*
- `@nestjs/mongoose` *core mongodb client*
- `@nestjs/platform-express` *core express component*
- `@nestjs/swagger` *core open-api component*
- `@nestjs/testing` *core test component*
- `@yelmer-samples/coffee-shared` *shared project data models*
- `axios` *http request*
- `cron` *to initialize cron jobs*
- `dotenv` *to read environment*
- `mongoose` *mongodb client*
- `reflect-metadata` *reflection*
- `rimraf` *clears dist*
- `rxjs` *handles header keys*
- `swagger-ui-express` *swagger ui*
- `uuid` *to generate uuid*

## OpenAPI
> All endpoints, dto(models) and entities are documented
> 
> Authentication (ApiKey style) was implemented
>
- [OpenAPI Interface / Swagger UI](http://localhost:8091/docs)
- `apiKey` : click security and fill it as `3de4ad39-0977-467f-8e07-70b3f3e4ebd3`

## Endpoints

- `POST` `/v1/weathers` *Fetches the latest weather by given city and adds it if weather was not already existed*
- `DELETE` `/v1/weathers/:cityId` *Deletes all weather info of given city*
- `GET` `/v1/weathers/:cityId/last` *Fetches the latest weather info of given city*
- `GET` `/v1/weathers/:cityId/history/:id` *Fetches historical weather info of given city except the latest*
- `GET` `/v1/weathers/latest-list` *Fetches the latest weather info of given cities*


## Postman
> At environment panel, you should set {{host}} and {{apiKey}}
> 
> **@TODO**
>
- `host` : `http://localhost:8091/`
- `apiKey` : `3de4ad39-0977-467f-8e07-70b3f3e4ebd3` - *to basic M2M security*
- [Postman Collection Export](./assets/coffee-weather.postman_collection.json)
- [Postman Environment Export](./assets/coffee-weather.postman_environment.json)

---
### Prepared by
- Mustafa Yelmer
- mustafayelmer(at)gmail.com
- `2021-10-10`