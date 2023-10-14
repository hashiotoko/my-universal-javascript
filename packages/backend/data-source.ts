import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 50000,
  username: 'admin',
  password: 'passowrd',
  database: 'myjs',
  synchronize: false,
  logging: true,
  entities: ['src/models/**/*.ts'],
  migrations: ['db/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});
