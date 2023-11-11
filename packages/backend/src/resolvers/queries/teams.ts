import { TeamRepository } from '../../repositories/team.repository';
import { Context } from '../context';
import { GQLQueryResolvers } from '../types';

export const teams: GQLQueryResolvers['teams'] = async (
  _parent: NonNullable<unknown>,
  _args: NonNullable<unknown>,
  _context: Context,
) => {
  return await TeamRepository.getAll();
};
