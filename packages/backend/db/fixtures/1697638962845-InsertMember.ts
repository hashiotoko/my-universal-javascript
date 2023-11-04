import { MigrationInterface, QueryRunner } from 'typeorm';
import { Team } from '../../src/models/team';
import { MemberRole } from '../../src/models/member-role';
import { Member, MemberAttrs } from '../../src/models/member';

export class InsertMember1697638962845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const fixture = await this.memberFixture(queryRunner);
    await queryRunner.manager.getRepository(Member).save(fixture);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE members DISABLE TRIGGER ALL;`);
    const memberRepository = queryRunner.manager.getRepository(Member);
    const fixture = await this.memberFixture(queryRunner);
    await memberRepository.remove(
      await memberRepository.find({
        where: fixture.map((member) => {
          return { name: member.name };
        }),
      }),
    );
    await queryRunner.query(`ALTER TABLE members ENABLE TRIGGER ALL;`);
  }

  private async memberFixture(
    queryRunner: QueryRunner,
  ): Promise<MemberAttrs[]> {
    const teamRepository = queryRunner.manager.getRepository(Team);
    const diamondTeam = await teamRepository.findOneByOrFail({
      name: 'diamond',
    });
    const emeraldTeam = await teamRepository.findOneByOrFail({
      name: 'emerald',
    });
    const rubyTeam = await teamRepository.findOneByOrFail({ name: 'ruby' });

    const memberRoleRepository = queryRunner.manager.getRepository(MemberRole);
    const adminRole = await memberRoleRepository.findOneByOrFail({
      name: 'admin',
    });
    const stuffRole = await memberRoleRepository.findOneByOrFail({
      name: 'stuff',
    });

    return [
      {
        team: diamondTeam,
        name: 'Snake',
        roles: [stuffRole],
      },
      {
        teamId: diamondTeam.id,
        name: 'Miller',
        roles: [adminRole],
      },
      {
        team: emeraldTeam,
        name: 'Naomi',
        roles: [stuffRole],
      },
      {
        team: emeraldTeam,
        name: 'Otacon',
        roles: [stuffRole, adminRole],
      },
      {
        team: emeraldTeam,
        name: 'Campbell',
        roles: [adminRole],
      },
      {
        team: rubyTeam,
        name: 'Ocelot',
        roles: [stuffRole, adminRole],
      },
      {
        team: rubyTeam,
        name: 'The BOSS',
        roles: [adminRole],
      },
    ];
  }
}
