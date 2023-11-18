import { GQLMemberRole, GQLMemberRoleResolvers } from './types';

export const MemberRole: GQLMemberRoleResolvers = {
  ADMIN: GQLMemberRole.Admin,
  STUFF: GQLMemberRole.Stuff,
};
