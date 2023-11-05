import { Context } from '../context';
import { GQLQueryResolvers } from '../types';

export const greeting: GQLQueryResolvers['greeting'] = async (
  _: {},
  _args: {},
  _context: Context,
) => {
  return 'Hello, world!';
};
