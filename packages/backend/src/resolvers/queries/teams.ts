import { TeamRepository } from '../../repositories/team.repository';
import { Context } from '../context';
import { GQLQueryResolvers } from '../types';

export const teams: GQLQueryResolvers['teams'] = async (
  _: {},
  _args: {},
  _context: Context,
) => {
  return await TeamRepository.getAll();
};
