import { Member } from '../../models/member';
import { GQLQueryResolvers } from '../types';
import short from 'short-uuid';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

// TODO: 汎用的な処理の抽出
export const members: GQLQueryResolvers['members'] = async (
  _parent,
  { first, after, last: last, before },
  context,
) => {
  if (first == null && last == null) {
    throw new Error('Argument `first` or `last` must be specified.');
  }

  if (typeof first === 'number') {
    if (!Number.isInteger(first) || first < 0) {
      throw new Error('Argument `first` must be a non-negative integer.');
    }

    if (typeof last === 'number') {
      throw new Error(
        'Passing both `first` and `last` to paginate is not supported.',
      );
    }
  }

  if (typeof last === 'number') {
    if (!Number.isInteger(last) || last < 0) {
      throw new Error('Argument `last` must be a non-negative integer.');
    }
  }

  const allMembers = await context.dataSource.getRepository(Member).find({
    relations: { roles: true },
    order: { id: 'ASC' },
  });

  // startOffset: ⚫︎の一番左
  // endOffset: ⚫︎の一番右 + 1
  // [⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎]
  let startOffset: number = 0;
  let endOffset: number = allMembers.length;
  let afterOffset: number = -1;
  let beforeOffset: number = allMembers.length;

  if (typeof first === 'number') {
    // 開始時 [⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎]
    if (typeof after === 'string') {
      const values = cursorToValues(after);
      console.log(`first after values: ${JSON.stringify(values)}`);

      afterOffset = allMembers.findIndex(
        (institution) =>
          institution.id === values[0] && institution.id === values[1],
      );
      if (afterOffset === -1) {
        throw new Error('INVALID_CURSOR_ARGUMENTS');
      }

      //  → 詰める
      // [⚪︎⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎]
      startOffset = afterOffset + 1;
    }

    if (typeof before === 'string') {
      const values = cursorToValues(before);
      console.log(`first before values: ${JSON.stringify(values)}`);

      beforeOffset = allMembers.findIndex(
        (institution) =>
          institution.id === values[0] && institution.id === values[1],
      );
      if (beforeOffset === -1) {
        throw new Error('INVALID_CURSOR_ARGUMENTS');
      }

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
      const values = cursorToValues(before);

      beforeOffset = allMembers.findIndex(
        (institution) =>
          institution.id === values[0] && institution.id === values[1],
      );
      if (beforeOffset === -1) {
        throw new Error('INVALID_CURSOR_ARGUMENTS');
      }

      // ← 詰める
      // [⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎⚪︎]
      endOffset = beforeOffset;
    }

    if (typeof after === 'string') {
      const values = cursorToValues(after);

      afterOffset = allMembers.findIndex(
        (institution) =>
          institution.id === values[0] && institution.id === values[1],
      );
      if (afterOffset === -1) {
        throw new Error('INVALID_CURSOR_ARGUMENTS');
      }

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

  const members = allMembers.slice(startOffset, endOffset);
  const edges = members.map((institution) => ({
    cursor: cursorFrom(institution.id, institution.id),
    node: institution,
  }));

  return {
    edges,
    nodes: members,
    pageInfo: {
      hasNextPage: typeof first === 'number' && endOffset < beforeOffset,
      hasPreviousPage:
        typeof last === 'number' && startOffset > afterOffset + 1,
      startCursor: members.length > 0 ? edges[0]!.cursor : null,
      endCursor: members.length > 0 ? edges.slice(-1)[0]!.cursor : null,
    },
    totalCount: allMembers.length,
  };
};

const CURSOR_VERSION = 'v1';

export function cursorFrom(
  id: string,
  orderValue: NonNullable<unknown>,
): string {
  console.log(`original: ${CURSOR_VERSION}:${id}:${orderValue}`);
  const shortId = short().fromUUID(id);
  // TODO: フィールドの型とかで圧縮方法を変更してカーソルをもうちょい短くする
  const shortOrderValue = compressToEncodedURIComponent(orderValue.toString());
  console.log(`shortId: ${shortId}`);
  console.log(`shortOrderValue: ${shortOrderValue}`);
  const str = `${CURSOR_VERSION}:${shortId}:${shortOrderValue}`;
  console.log(`base64 before: ${str}`);
  const cursor = btoa(str);
  console.log(`base64 after(cursor): ${cursor}`);

  return cursor;
}

export function cursorToValues(cursor: string): string[] {
  const values = atob(cursor).split(':');
  if (values.length !== 3 || !values.every((v) => typeof v === 'string')) {
    throw new Error('invalid cursor');
  }

  const id = short().toUUID(values[1] as string);
  const orderValue = decompressFromEncodedURIComponent(values[2] as string);
  return [id, orderValue];
}
