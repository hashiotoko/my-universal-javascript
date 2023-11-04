import { DataSource } from 'typeorm';
import { prepareConnection, refreshDatabase } from '../test-helper';
import { teamFixture } from '../../db/fixtures/data/team';
import { Team } from '../../src/models/team';
import { TeamRepository } from '../../src/repositories/team.repository';

let dataSource: DataSource;

beforeAll(async () => {
  dataSource = await prepareConnection();
});

afterAll(async () => {
  dataSource.destroy();
});

describe('TeamRepository', () => {
  describe('getAll', () => {
    it('is getting all teams', async () => {
      await refreshDatabase(dataSource, async (manager) => {
        await manager.getRepository(Team).save(teamFixture);

        // NOTE: トランザクション内でカスタムリポジトリを使用する場合は withRepository で呼び出す必要がある
        //       ref. https://orkhan.gitbook.io/typeorm/docs/custom-repository#using-custom-repositories-in-transactions
        const repository = manager.withRepository(TeamRepository);
        const teams = await repository.getAll();

        expect(teams.length).toBe(3);
        expect(teams.map((team) => team.name)).toEqual(
          teamFixture.map((team) => team.name),
        );
      });
    });
  });
});
