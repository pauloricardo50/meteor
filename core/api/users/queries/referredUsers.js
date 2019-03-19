import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { proUser } from '../../fragments';

export default Users.createQuery(USER_QUERIES.REFERRED_USERS, proUser());
