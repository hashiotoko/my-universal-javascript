// import { Repository, DataSource } from 'typeorm';
import { Team } from '../models/team';
import { AppDataSource } from '../data-source';

export const TeamRepository = AppDataSource.getRepository(Team).extend({
  async getAll(): Promise<Team[]> {
    return this.find();
  },
});
