import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 50001,
  username: 'admin',
  password: 'passowrd',
  database: 'myjs_test',
  synchronize: false,
  logging: false,
  entities: ['src/models/**/*.ts'],
  migrations: ['db/{migrations, seeds}/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});
