import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {WeatherService} from "../weather/WeatherService";

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    @Cron(process.env.SCHEDULER_PATTERN ?? '0 0 0 * * *')
    handleCron(): void {
        this._runAsync().then();
    }
    private async _runAsync(): Promise<void> {
        try {
            const count = await WeatherService.INS.fetchAllCities();
            this.logger.debug(`${count} cities were fetched`);
        } catch (e) {
            this.logger.error(e.message);
        }
    }
}