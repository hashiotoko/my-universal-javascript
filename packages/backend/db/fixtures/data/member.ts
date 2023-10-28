import { Team } from '../../../src/models/team.js';
import { AppDataSource } from '../../../data-source.js';
import { MemberAttrs } from '../../../src/models/member.js';
import { MemberRole } from '../../../src/models/member-role.js';

const teamRepository = AppDataSource.manager.getRepository(Team);
const diamondTeam = await teamRepository.findOneByOrFail({ name: 'diamond' });
const emeraldTeam = await teamRepository.findOneByOrFail({ name: 'emerald' });
const rubyTeam = await teamRepository.findOneByOrFail({ name: 'ruby' });

const memberRoleRepository = AppDataSource.manager.getRepository(MemberRole);
const adminRole = await memberRoleRepository.findOneByOrFail({ name: 'admin' });
const stuffRole = await memberRoleRepository.findOneByOrFail({ name: 'stuff' });

export const memberFixture: MemberAttrs[] = [
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
