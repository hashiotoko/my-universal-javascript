import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import path from 'path';
import { DataSource, EntityManager } from 'typeorm';
import resolvers from '../src/resolvers';
import { Context } from '../src/resolvers/context';
import { AppDataSource } from '../src/data-source';

export async function prepareConnection() {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  await AppDataSource.initialize();
  return AppDataSource;
}

export const refreshDatabase = async (
  dataSource: DataSource,
  test: (_conn: EntityManager) => Promise<unknown>,
) => {
  if (!dataSource) {
    throw new Error('Datasource must be initialized!');
  }
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.startTransaction();
  await test(queryRunner.manager);
  await queryRunner.rollbackTransaction();
  await queryRunner.release();
};

export const testServer = new ApolloServer<Context>({
  typeDefs: readFileSync(path.join(__dirname, '../dist/schema.gql'), 'utf8'),
  resolvers,
});
