import { DataSource, EntityManager } from 'typeorm';
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
