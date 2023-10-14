import { AppDataSource } from '../../../data-source.js';
import { MemberAttrs } from '../../../src/models/member.js';
import { Team } from '../../../src/models/team.js';

const teamRepository = AppDataSource.manager.getRepository(Team);
const diamondTeam = await teamRepository.findOneByOrFail({ name: 'diamond' });
const emeraldTeam = await teamRepository.findOneByOrFail({ name: 'emerald' });
const rubyTeam = await teamRepository.findOneByOrFail({ name: 'ruby' });

export const memberSeed: MemberAttrs[] = [
  {
    team: diamondTeam,
    name: 'Snake',
  },
  {
    teamId: diamondTeam.id,
    name: 'Miller',
  },
  {
    team: emeraldTeam,
    name: 'Naomi',
  },
  {
    team: emeraldTeam,
    name: 'Otacon',
  },
  {
    team: emeraldTeam,
    name: 'Campbell',
  },
  {
    team: rubyTeam,
    name: 'Ocelot',
  },
  {
    team: rubyTeam,
    name: 'The BOSS',
  },
];
