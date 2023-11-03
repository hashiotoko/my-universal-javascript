import { DataSource, Repository } from 'typeorm';
import { Team } from '../models/team';

// ref. https://github.com/typeorm/typeorm/issues/9013#issuecomment-1336420815
export class TeamRepository extends Repository<Team> {
  constructor(dataSource: DataSource) {
    super(Team, dataSource.createEntityManager());
  }

  async getAll(): Promise<Team[]> {
    return this.find();
  }
}
