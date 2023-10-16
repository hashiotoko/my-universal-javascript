import { MigrationInterface, QueryRunner } from 'typeorm';
import { memberRoleSeed } from './data/member-role.js';
import { MemberRole } from '../../src/models/member-role.js';

export class InsertMemberRole1697337500505 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.getRepository(MemberRole).save(memberRoleSeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const repository = queryRunner.manager.getRepository(MemberRole);
    repository.remove(
      await repository.find({
        where: memberRoleSeed.map((memberRole) => {
          return { name: memberRole.name };
        }),
      }),
    );
  }
}
