import { Member } from '../../models/member';
import {
  GQLMemberFilter,
  GQLOrderDirection,
  GQLQueryResolvers,
} from '../types';
import {
  connectionFromNodes,
  validateFetchElementNumberArgs,
} from '../../utils/pagination';
import { camelCase } from 'lodash';

export const members: GQLQueryResolvers['members'] = async (
  _parent,
  { first, after, last: last, before, filter, orderBy },
  context,
) => {
  validateFetchElementNumberArgs({ first, last });

  const whereConditions: { [key: string]: unknown } =
    Object.keys(filter || {}).length === 0 ? {} : (filter as GQLMemberFilter);

  const order: { -readonly [key in keyof Partial<Member>]: GQLOrderDirection } =
    {};
  if (orderBy != null)
    order[camelCase(orderBy.field) as keyof Member] = orderBy.direction;
  order.id = orderBy?.direction || GQLOrderDirection.Asc;

  const _members = await context.dataSource.getRepository(Member).find({
    where: { ...whereConditions },
    relations: { roles: true },
    order,
  });

  return connectionFromNodes(
    _members,
    { first, after, last, before, orderBy },
    true,
  );
};
