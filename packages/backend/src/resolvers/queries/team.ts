import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { Team } from '../../models/team';
import { GQLQueryResolvers } from '../types';
import { NotFoundError } from '../../utils/error';

export const team: GQLQueryResolvers['team'] = async (
  _parent,
  { id },
  context,
) => {
  try {
    const team = await context.dataSource.getRepository(Team).findOneBy({ id });
    console.log(`resolover team: ${JSON.stringify(team)}`);
    console.log(`resolover team id : ${id}`);
    return team;
  } catch (error) {
    if (
      error instanceof QueryFailedError ||
      error instanceof EntityNotFoundError
    ) {
      throw new NotFoundError('Requested medicalInstitution not found.');
    }
    throw error;
  }
};
