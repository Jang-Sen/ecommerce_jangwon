import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieService {
  // @Cron('* * * * * *')
  handleCron() {
    console.log('Called when the current second is 5');
  }
}
