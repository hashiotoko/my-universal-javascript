import { TeamRepository } from '../../repositories/team.repository';
import { GQLQueryResolvers } from '../types';

export const teams: GQLQueryResolvers['teams'] = async (
  _parent,
  _args,
  _context,
) => {
  return await TeamRepository.getAll();
};
