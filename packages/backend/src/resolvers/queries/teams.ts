import { FieldNode } from 'graphql';
import { camelCase } from 'lodash';
import { GQLOrderDirection, GQLQueryResolvers, GQLTeamFilter } from '../types';
import { Team } from '../../models/team';
import {
  connectionFromNodes,
  validateFetchElementNumberArgs,
} from '../../utils/pagination';
import { BadRequestError } from '../../utils/error';

export const teams: GQLQueryResolvers['teams'] = async (
  _parent,
  { first, after, last: last, before, filter, orderBy },
  context,
  info,
) => {
  validateFetchElementNumberArgs({ first, last });

  const whereConditions: { [key: string]: unknown } =
    Object.keys(filter || {}).length === 0 ? {} : (filter as GQLTeamFilter);

  const order: { -readonly [key in keyof Partial<Team>]: GQLOrderDirection } =
    {};
  if (orderBy != null)
    order[camelCase(orderBy.field) as keyof Team] = orderBy.direction;
  order.id = orderBy?.direction || GQLOrderDirection.Asc;

  const _teams = await context.dataSource.getRepository(Team).find({
    where: { ...whereConditions },
    relations: { members: true },
    order,
  });

  const connection = connectionFromNodes(
    _teams,
    { first, after, last, before, orderBy },
    true,
  );

  if (
    connection.edges.length > 1 &&
    (doesPathExist(info.fieldNodes, ['teams', 'nodes', 'members']) ||
      doesPathExist(info.fieldNodes, ['teams', 'edges', 'node', 'members']))
  ) {
    throw new BadRequestError(
      '`teams` > `members` field can be fetched when teams is limited to a single case',
    );
  }

  return connection;
};

function doesPathExist(
  nodes: ReadonlyArray<FieldNode>,
  path: string[],
): boolean {
  const node = nodes.find((n) => n.name.value === path[0]);
  if (!node) return false;
  if (path.length === 1) return true;

  return doesPathExist(
    node.selectionSet!.selections as FieldNode[],
    path.slice(1),
  );
}
