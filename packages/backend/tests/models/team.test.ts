import { describe, test, expect } from '@jest/globals';
import { Team } from '../../src/models/team.js';

describe('Team', () => {
  describe('constructor', () => {
    describe('when not passed argument', () => {
      test('attribute values are undefined', async () => {
        const team = new Team();
        expect(team.id).toEqual(undefined);
        expect(team.name).toEqual(undefined);
        expect(team.postalCode).toEqual(undefined);
      });
    });
    describe('when passed arguments', () => {
      test('attribute values are present', async () => {
        const team = new Team({
          name: 'Snake',
          postalCode: '1234567',
          mailAddress: 'team1@example.com',
        });
        expect(team.name).toEqual('Snake');
        expect(team.postalCode).toEqual('1234567');
        expect(team.mailAddress).toEqual('team1@example.com');
      });
    });
  });
});
