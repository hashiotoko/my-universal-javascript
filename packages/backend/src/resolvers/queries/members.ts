import { Member } from '../../models/member';
import { GQLQueryResolvers } from '../types';

export const members: GQLQueryResolvers['members'] = async (
  _parent,
  _args,
  context,
) => {
  return await context.dataSource.getRepository(Member).find({
    relations: {
      roles: true,
    },
  });
};
