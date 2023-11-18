import { ApolloServerErrorCode } from '@apollo/server/errors';
import assert from 'assert';
import gql from 'graphql-tag';
import { DataSource } from 'typeorm';
import { prepareConnection, testServer } from '../../test-helper';
import { Team } from '../../../src/models/team';
import { GQLQuery } from '../../../src/resolvers/types';
import { Context } from '../../../src/resolvers/context';
import { MyjsErrorCode } from '../../../src/utils/error';

let dataSource: DataSource;
let contextValue: Context;
let team: Team;

beforeAll(async () => {
  dataSource = await prepareConnection();
  contextValue = { dataSource };
  // NOTE: このテストでは refreshDatabase 使うとクエリからエンティティを取得できないので以下のようにしている・・・
  team = await dataSource.getRepository(Team).save({
    name: 'diamond',
    postalCode: '1234567',
    mailAddress: 'team1@example.com',
  });
});

afterAll(async () => {
  await dataSource.getRepository(Team).remove(team);
  await dataSource.destroy();
});

describe('team', () => {
  describe('when valid query', () => {
    const query = async () => {
      return testServer.executeOperation<GQLQuery>(
        {
          query: gql`
            query fetchTeam($teamId: ID!) {
              team(id: $teamId) {
                id
                name
                postalCode
                mailAddress
                firstLoggedInAt
                createdAt
                updatedAt
              }
            }
          `,
          variables: { teamId: team.id },
        },
        { contextValue },
      );
    };

    it('can fetch', async () => {
      const { body } = await query();
      assert(body.kind === 'single');
      expect(body.singleResult.errors).toBeUndefined();
      expect(body.singleResult.data?.team).toEqual({
        id: team.id,
        name: team.name,
        postalCode: team.postalCode,
        mailAddress: team.mailAddress,
        firstLoggedInAt: team.firstLoggedInAt,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      });
    });
  });

  describe('when invalid query', () => {
    describe('without pdtId', () => {
      const query = async () => {
        return testServer.executeOperation<GQLQuery>(
          {
            query: gql`
              query fetchTeam($teamId: ID!) {
                team(id: $teamId) {
                  id
                  name
                  postalCode
                  mailAddress
                  firstLoggedInAt
                  createdAt
                  updatedAt
                }
              }
            `,
            variables: { teamId: null },
          },
          { contextValue },
        );
      };

      it('cannot fetch', async () => {
        const { body } = await query();
        assert(body.kind === 'single');
        expect(body.singleResult.errors).not.toBeUndefined();
        expect(body.singleResult.errors![0]!.extensions?.code).toBe(
          ApolloServerErrorCode.BAD_USER_INPUT,
        );
        expect(body.singleResult.data).toBeUndefined();
      });
    });

    describe('with wrong teamId', () => {
      const query = async () => {
        return testServer.executeOperation<GQLQuery>(
          {
            query: gql`
              query fetchTeam($teamId: ID!) {
                team(id: $teamId) {
                  id
                  name
                  postalCode
                  mailAddress
                  firstLoggedInAt
                  createdAt
                  updatedAt
                }
              }
            `,
            variables: { teamId: 'wrongTeamId' },
          },
          { contextValue },
        );
      };

      it('cannot fetch', async () => {
        const { body } = await query();
        assert(body.kind === 'single');
        expect(body.singleResult.errors).not.toBeUndefined();
        expect(body.singleResult.errors![0]!.extensions?.code).toBe(
          MyjsErrorCode.NOT_FOUND,
        );
        expect(body.singleResult.data?.team).toBeNull();
      });
    });

    describe('with wrong field', () => {
      const query = async () => {
        return testServer.executeOperation<GQLQuery>(
          {
            query: gql`
              query fetchTeam($teamId: ID!) {
                teammmmmm(id: $teamId) {
                  id
                  name
                  postalCode
                  mailAddress
                  firstLoggedInAt
                  createdAt
                  updatedAt
                }
              }
            `,
            variables: { teamId: team.id },
          },
          { contextValue },
        );
      };

      it('cannot fetch', async () => {
        const { body } = await query();
        assert(body.kind === 'single');
        expect(body.singleResult.errors).not.toBeUndefined();
        expect(body.singleResult.errors![0]!.extensions?.code).toBe(
          ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED,
        );
        expect(body.singleResult.data).toBeUndefined();
      });
    });
  });
});
