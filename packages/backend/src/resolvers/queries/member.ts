import { Member } from '../../models/member';
import { GQLQueryResolvers } from '../types';

export const member: GQLQueryResolvers['member'] = async (
  _parent,
  { id },
  context,
) => {
  return await context.dataSource.getRepository(Member).findOneByOrFail({ id });
};
