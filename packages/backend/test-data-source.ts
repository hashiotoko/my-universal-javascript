import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 50001,
  username: 'admin',
  password: 'passowrd',
  database: 'myjs_test',
  synchronize: true,
  logging: true,
  entities: ['src/models/**/*.ts'],
  migrations: ['db/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});
