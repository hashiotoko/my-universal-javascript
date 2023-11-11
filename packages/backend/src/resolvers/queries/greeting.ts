import { Context } from '../context';
import { GQLQueryResolvers } from '../types';

export const greeting: GQLQueryResolvers['greeting'] = async (
  _: NonNullable<unknown>,
  _args: NonNullable<unknown>,
  _context: Context,
) => {
  return 'Hello, world!';
};
