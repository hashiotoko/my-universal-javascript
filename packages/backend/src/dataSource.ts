import { TestDataSource } from '../test-data-source.js';
import { AppDataSource } from '../data-source.js';

export const dataSource =
  process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
