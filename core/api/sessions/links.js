import Users from '../users/users';
import Sessions from './sessions';

Sessions.addLinks({
  impersonatingAdmin: {
    field: 'impersonatingAdminLink',
    collection: Users,
    type: 'one',
    metadata: true,
  },
});
