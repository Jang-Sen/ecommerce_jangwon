import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const ip = req.headers['x-forwarded-for'] || req.ip; // 프록시 고려
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - startTime;
      const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength || 0} - ${responseTime}ms - IP: ${ip}`;
      this.logger.log(logMessage);
    });

    next();
  }
}
