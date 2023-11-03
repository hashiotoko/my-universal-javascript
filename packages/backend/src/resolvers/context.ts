import type express from 'express';
import { dataSource } from '../dataSource';

export type Context = {
  dataSource: typeof dataSource;
};

export const context = async (
  _req: express.Request,
  _res: express.Response,
): Promise<Context> => {
  return {
    dataSource,
  };
};
