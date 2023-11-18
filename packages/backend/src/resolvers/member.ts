import { GQLMemberResolvers } from './types';

export const Member: GQLMemberResolvers = {
  roles: async (parent) => parent.roles.map((role) => role.name),
};
