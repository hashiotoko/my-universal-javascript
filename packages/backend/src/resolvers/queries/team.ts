import { TeamRepository } from '../../repositories/team.repository';
import { Context } from '../context';
import { GQLQueryResolvers } from '../types';

export const team: GQLQueryResolvers['team'] = async (
  _parent: NonNullable<unknown>,
  { id },
  _context: Context,
) => {
  return await TeamRepository.findOneBy({ id });
};
