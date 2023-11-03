import 'reflect-metadata';
import { DataSource } from 'typeorm';
const { DB_URL } = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: DB_URL,
  synchronize: false,
  logging: true,
  entities: ['src/models/**/*.ts'],
  migrations: ['db/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});
