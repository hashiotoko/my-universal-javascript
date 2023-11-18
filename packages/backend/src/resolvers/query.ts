import { GQLQueryResolvers } from './types';
import { member, members, team, teams } from './queries';

export const Query: GQLQueryResolvers = {
  member,
  members,
  team,
  teams,
};
