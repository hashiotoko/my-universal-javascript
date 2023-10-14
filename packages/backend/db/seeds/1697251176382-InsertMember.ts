import { MigrationInterface, QueryRunner } from 'typeorm';
import { Member } from '../../src/models/member.js';
import { memberSeed } from './data/member.js';

export class InsertMember1697251176382 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.getRepository(Member).save(memberSeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const repository = queryRunner.manager.getRepository(Member);
    repository.remove(
      await repository.find({
        where: memberSeed.map((member) => {
          return { name: member.name };
        }),
      }),
    );
  }
}
