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
    return await context.dataSource.getRepository(Team).findOneBy({ id });
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
