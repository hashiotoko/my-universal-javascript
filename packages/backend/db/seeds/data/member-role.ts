import {
  MemberRoleAttrs,
  MemberRole,
} from '../../../src/models/member-role.js';

export const memberRoleSeed: MemberRoleAttrs[] = [
  {
    name: MemberRole.NAMES.admin,
  },
  {
    name: MemberRole.NAMES.stuff,
  },
];
