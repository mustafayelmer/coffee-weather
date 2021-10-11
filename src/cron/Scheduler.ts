import { CronJob } from 'cron';
import {WeatherService} from "../weather/WeatherService";

export class Scheduler {
    private static _cron: CronJob;
    // private static CRON_TIMER = '0 * * * * *'; // run at every hour (minute: 0)
    private static CRON_TIMER = '*/3 * * * * *'; // run at every ten minutes, for only testing

    static initialize(): void {
        // start 10 seconds later
        setTimeout(() => this._start(), 10000);
    }

    private static _start(): void {
        // run at every hour (minute: 0)
        this._cron = new CronJob(this.CRON_TIMER, async () => {
            try {
                const count = await WeatherService.INS.fetchAllCities();
                console.log(`${count} cities were fetched`);
            } catch (e) {
                console.error(e);
            }
        });

        // Start job
        if (!this._cron.running) {
            this._cron.start();
        }
    }
}