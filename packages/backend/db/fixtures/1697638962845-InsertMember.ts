import { MigrationInterface, QueryRunner } from 'typeorm';
import { Member } from '../../src/models/member.js';
import { memberFixture } from './data/member.js';

export class InsertMember1697638962845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.getRepository(Member).save(memberFixture);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE members DISABLE TRIGGER ALL;`);
    const memberRepository = queryRunner.manager.getRepository(Member);
    memberRepository.metadata;
    await memberRepository.remove(
      await memberRepository.find({
        where: memberFixture.map((member) => {
          return { name: member.name };
        }),
      }),
    );
    await queryRunner.query(`ALTER TABLE members ENABLE TRIGGER ALL;`);
  }
}
