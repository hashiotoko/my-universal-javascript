import { GraphQLList } from 'graphql';
import { getMemberList } from '../member/resolvers';
import { memberType } from '../member/types';

export const memberQuery = {
  memberList: {
    type: new GraphQLList(memberType),
    description: 'Get list of members data.',
    resolve: getMemberList,
  },
};
