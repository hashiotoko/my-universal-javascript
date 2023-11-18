import { GQLQueryResolvers } from './types';
import { greeting, member, members, team, teams } from './queries';

export const Query: GQLQueryResolvers = {
  greeting,
  member,
  members,
  team,
  teams,
};
