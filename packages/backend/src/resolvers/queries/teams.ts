import { TeamRepository } from '../../repositories/team.repository';
import { Context } from '../context';

export const teams = async (_: {}, _args: {}, context: Context) => {
  return await new TeamRepository(context.dataSource).getAll();
};
