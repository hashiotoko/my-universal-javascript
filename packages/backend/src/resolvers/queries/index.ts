import { users, books } from '../../data';
import { teams } from './teams';

const Query = {
  users: () => users,
  books: () => books,
  teams,
};

export default Query;
