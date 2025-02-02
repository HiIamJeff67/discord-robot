import { Injectable, Logger } from '@nestjs/common';
import { MiddlewareOptions, TRPCMiddleware } from 'nestjs-trpc';
import { AppContextInterface } from '../context/context.interface';

// Inject this service, and use it as decorator of 'UseMiddleware()' to log the request and response
@Injectable()
export class TrpcLoggerMiddleware implements TRPCMiddleware {
  private readonly logger = new Logger(TrpcLoggerMiddleware.name);

  async use(opts: MiddlewareOptions<AppContextInterface>) {
    const start = Date.now();
    const { next, path, type } = opts;
    const result = await next();

    const { req, res } = opts.ctx;
    const meta = {
      path,
      type,
      durationMs: Date.now() - start,
      method: req.method,
      statusCode: res.statusCode,
      ip: req.ip,
      headers: req.headers,
      cookie: res.cookie,
    };

    console.log(result, `result: ${result.ok}`);

    result.ok
      ? this.logger.log('Success', meta)
      : this.logger.error('Error', meta);

    return result;
  }
}
