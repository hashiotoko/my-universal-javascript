import { camelCase } from 'lodash';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import short from 'short-uuid';
import { BadRequestError } from './error';
import { GQLOrderDirection } from '../resolvers/types';
import { errorLogger } from './logger';

type FetchElementNumberArg = number | undefined | null;
type ConnectionArgs = {
  first?: FetchElementNumberArg;
  last?: FetchElementNumberArg;
  after?: string | null;
  before?: string | null;
  orderBy?: {
    field: string;
    direction: GQLOrderDirection;
  } | null;
};
type Node = { id: string };

const CURSOR_VERSION = 'v1';
const CURSOR_SEPARATOR = '|';

export function validateFetchElementNumberArgs(args: {
  first: FetchElementNumberArg;
  last: FetchElementNumberArg;
}) {
  const { first, last } = args;
  if (first == null && last == null) {
    throw new BadRequestError('Argument `first` or `last` must be specified.');
  }

  if (typeof first === 'number') {
    if (first < 0) {
      throw new BadRequestError(
        'Argument `first` must be a non-negative integer.',
      );
    }

    if (typeof last === 'number') {
      throw new BadRequestError(
        'Passing both `first` and `last` argument to paginate is not supported.',
      );
    }
  }

  if (typeof last === 'number' && last < 0) {
    throw new BadRequestError(
      'Argument `last` must be a non-negative integer.',
    );
  }
}

// TODO: 必要なら Node のユニークキーは id 以外も指定可能にする
export function connectionFromNodes<T extends Node>(
  allNodes: Array<T>,
  args: ConnectionArgs,
  skipValidate: boolean = false,
) {
  const { first, last, after, before, orderBy } = args;
  if (!skipValidate) {
    validateFetchElementNumberArgs({ first, last });
  }

  // startOffset: ⚫︎の一番左
  // endOffset: ⚫︎の一番右 + 1
  // [⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎]
  let startOffset: number = 0;
  let endOffset: number = allNodes.length;
  let afterOffset: number = -1;
  let beforeOffset: number = allNodes.length;

  if (typeof first === 'number') {
    // 開始時 [⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎]
    if (typeof after === 'string') {
      afterOffset = afterOffsetFrom(allNodes, after, orderBy?.field);

      //  → 詰める
      // [⚪︎⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎]
      startOffset = afterOffset + 1;
    }

    if (typeof before === 'string') {
      beforeOffset = beforeOffsetFrom(allNodes, before, orderBy?.field);

      // ← 詰める
      // [⚪︎⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎]
      endOffset = beforeOffset;
    }

    // [⚪︎⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎] とすると
    //
    // startOffset + first >= endOffset
    // => そのまま
    // => [⚪︎⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎]
    // startOffset + first < endOffset
    // => ← さらに詰める
    // => [⚪︎⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎⚪︎⚪︎]
    endOffset = Math.min(startOffset + first, endOffset);
  }

  if (typeof last === 'number') {
    // 開始時 [⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎]
    if (typeof before === 'string') {
      beforeOffset = beforeOffsetFrom(allNodes, before, orderBy?.field);

      // ← 詰める
      // [⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎⚪︎]
      endOffset = beforeOffset;
    }

    if (typeof after === 'string') {
      afterOffset = afterOffsetFrom(allNodes, after, orderBy?.field);

      // → 詰める
      // [⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎⚪︎]
      startOffset = afterOffset + 1;
    }

    // [⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎⚪︎] とすると
    //
    // endOffset - last <= startOffset
    // => そのまま
    // => [⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎⚪︎]
    // endOffset - last > startOffset
    // => → さらに詰める
    // => [⚪︎⚪︎⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎⚪︎]
    startOffset = Math.max(endOffset - last, startOffset);
  }

  const nodes = allNodes.slice(startOffset, endOffset);

  const edges = nodes.map((node) => ({
    cursor: cursorFrom(
      node.id,
      orderBy?.field,
      orderBy?.field != null
        ? node[camelCase(orderBy.field) as keyof T]
        : undefined,
    ),
    node,
  }));

  return {
    edges,
    nodes,
    pageInfo: {
      hasNextPage: typeof first === 'number' && endOffset < beforeOffset,
      hasPreviousPage:
        typeof last === 'number' && startOffset > afterOffset + 1,
      startCursor: edges.length > 0 ? edges[0]!.cursor : null,
      endCursor: edges.length > 0 ? edges.slice(-1)[0]!.cursor : null,
    },
    totalCount: allNodes.length,
  };
}

function afterOffsetFrom<T extends Node>(
  allNodes: Array<T>,
  after: string,
  orderByField: string | undefined,
): number {
  const values = cursorToValues(after, orderByField);
  const afterOffset = allNodes.findIndex(
    (node) =>
      node.id === values.id &&
      (orderByField
        ? node[camelCase(orderByField) as keyof T] === values.orderValue
        : true),
  );
  if (afterOffset === -1) {
    throw new BadRequestError(
      `\`${after}\`does not appear to be a valid cursor.`,
    );
  }
  return afterOffset;
}

function beforeOffsetFrom<T extends Node>(
  allNodes: Array<T>,
  before: string,
  orderByField: string | undefined,
): number {
  const values = cursorToValues(before, orderByField);
  const beforeOffset = allNodes.findIndex(
    (node) =>
      node.id === values.id &&
      (orderByField
        ? node[camelCase(orderByField) as keyof T] === values.orderValue
        : true),
  );
  if (beforeOffset === -1) {
    throw new BadRequestError(
      `\`${before}\`does not appear to be a valid cursor.`,
    );
  }

  return beforeOffset;
}

function cursorFrom(
  id: string,
  orderField: string | undefined,
  orderValue: unknown,
): string {
  const cursorOrigins = [CURSOR_VERSION, short().fromUUID(id)];
  if (orderField != null) {
    cursorOrigins.push(
      orderField,
      compressToEncodedURIComponent(orderValue!.toString()),
    );
  }
  return btoa(cursorOrigins.join(CURSOR_SEPARATOR));
}

// TODO: 日付に対応する必要ありそう？
function cursorToValues(
  cursor: string,
  orderField: string | undefined,
): { id: string; orderValue: string | undefined } {
  let values: string[];
  try {
    values = atob(cursor).split(CURSOR_SEPARATOR);
  } catch (e) {
    errorLogger(e);
    throw new BadRequestError(
      `\`${cursor}\`does not appear to be a valid cursor.`,
    );
  }
  const cursorOrderField: string | undefined = values[2];
  if (cursorOrderField !== orderField) {
    throw new BadRequestError(
      'It is possible to specify the cursor when the `orderBy` is fixed.',
    );
  }

  const id = short().toUUID(values[1] || '');
  const orderValue = cursorOrderField
    ? decompressFromEncodedURIComponent(values[3]!)
    : undefined;
  return { id, orderValue };
}
