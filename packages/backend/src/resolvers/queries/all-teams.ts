import { TeamRepository } from '../../repositories/team.repository';
import { GQLQueryResolvers } from '../types';

export const allTeams: GQLQueryResolvers['allTeams'] = async (
  _parent,
  _args,
  _context,
) => {
  return await TeamRepository.getAll();
};
