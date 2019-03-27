import { Users } from '../..';
import { USER_QUERIES } from '../userConstants';
import { adminUser } from '../../fragments';

export default Users.createQuery(USER_QUERIES.ADMIN_USERS, adminUser());
