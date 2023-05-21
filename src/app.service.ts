import { Injectable } from '@nestjs/common';

export interface HealthResponse {
  date: Date;
  health: string;
}

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return { date: new Date(), health: 'ok' };
  }
}
