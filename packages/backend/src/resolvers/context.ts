import type express from 'express';
import { AppDataSource } from '../data-source';

export type Context = {
  dataSource: typeof AppDataSource;
};

export const context = async (
  _req: express.Request,
  _res: express.Response,
): Promise<Context> => {
  return {
    dataSource: AppDataSource,
  };
};
