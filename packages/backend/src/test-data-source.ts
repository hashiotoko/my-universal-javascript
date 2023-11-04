import 'reflect-metadata';
import { DataSource } from 'typeorm';
const { DB_URL } = process.env;

export const TestDataSource = new DataSource({
  type: 'postgres',
  url: DB_URL,
  synchronize: false,
  logging: false,
  entities: ['src/models/**/*.ts'],
  migrations: ['db/@(migrations|seeds)/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});
