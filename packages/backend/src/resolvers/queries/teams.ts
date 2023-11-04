import { TeamRepository } from '../../repositories/team.repository';
import { Context } from '../context';

export const teams = async (_: {}, _args: {}, _context: Context) => {
  return await TeamRepository.getAll();
};
