import { GQLQueryResolvers } from './types';
import { member, members, team, allTeams, teams } from './queries';

export const Query: GQLQueryResolvers = {
  member,
  members,
  team,
  allTeams,
  teams,
};
