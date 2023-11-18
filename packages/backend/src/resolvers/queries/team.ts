import { Team } from '../../models/team';
import { GQLQueryResolvers } from '../types';

export const team: GQLQueryResolvers['team'] = async (
  _parent,
  { id },
  context,
) => {
  return await context.dataSource.getRepository(Team).findOneBy({ id });
};
