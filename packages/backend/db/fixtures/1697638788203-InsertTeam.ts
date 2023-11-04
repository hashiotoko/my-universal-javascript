import { MigrationInterface, QueryRunner } from 'typeorm';
import { Team } from '../../src/models/team';
import { teamFixture } from './data/team';

export class InsertTeam1697638788203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.getRepository(Team).save(teamFixture);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const repository = queryRunner.manager.getRepository(Team);
    repository.remove(
      await repository.find({
        where: teamFixture.map((team) => {
          return { name: team.name };
        }),
      }),
    );
  }
}
