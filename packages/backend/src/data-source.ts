import 'reflect-metadata';
import { DataSource } from 'typeorm';
const { DB_URL, DB_MIGRATION, DB_LOGGING, NODE_ENV } = process.env;
const isDbMigration = DB_MIGRATION === 'true';
const isTest = NODE_ENV === 'test';
const canRunTypeScript = isDbMigration || isTest;

const migrations = canRunTypeScript
  ? isTest
    ? ['db/@(migrations|seeds)/**/*.ts']
    : ['db/**/*.ts']
  : [];

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DB_URL,
  synchronize: false,
  logging: DB_LOGGING == 'true',
  entities: canRunTypeScript ? ['src/models/**/*.ts'] : ['dist/models/**/*.js'],
  migrations,
  subscribers: canRunTypeScript
    ? ['src/subscribers/**/*.ts']
    : ['dist/subscribers/**/*.js'],
});
