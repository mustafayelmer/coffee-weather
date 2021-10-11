import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import {ErrorResponse, UnauthorizedError} from "@yelmer-samples/coffee-shared";

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void {
        if (typeof req?.header === 'function' && req.header('x-api-key') === process.env.SELF_API_KEY) {
            next();
        } else {
            ErrorResponse.directError(res, new UnauthorizedError());
        }
    }
}
