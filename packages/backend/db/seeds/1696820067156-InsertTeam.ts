import { MigrationInterface, QueryRunner } from 'typeorm';
import { Team } from '../../src/models/team.js';
import { teamSeed } from './data/team.js';

export class InsertTeam1696820067156 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.getRepository(Team).save(teamSeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const repository = queryRunner.manager.getRepository(Team);
    repository.remove(
      await repository.find({
        where: teamSeed.map((team) => {
          return { name: team.name };
        }),
      })
    );
  }
}
