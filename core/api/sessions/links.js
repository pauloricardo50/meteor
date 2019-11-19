import Sessions from './sessions';
import { Users } from '..';

Sessions.addLinks({
  impersonatingAdmin: {
    field: 'impersonatingAdminLink',
    collection: Users,
    type: 'one',
    metadata: true,
  },
});
