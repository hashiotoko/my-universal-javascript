import onFinished from 'on-finished';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import isEmpty from 'lodash/isEmpty';
import { requestLogger, responseLogger } from '../utils/logger';

export const loggerMiddleware =
  () => (req: Request, res: Response, next: NextFunction) => {
    const requestId = uuid();
    res.set('x-request-id', requestId);

    requestLogger({
      requestId,
      ...transformReq(req),
    });

    onFinished(res, (error) => {
      responseLogger({
        requestId,
        error: error ? error.stack : null,
        ...transformRes(res),
      });
    });

    return next();
  };

function transformReq(req: Request) {
  const { method, headers, path, query, body } = req;
  const parsedBody = isEmpty(body) ? null : JSON.parse(body);
  return { method, headers, path, query, parsedBody };
}
function transformRes(res: Response) {
  const { statusCode } = res;
  return { statusCode };
}
