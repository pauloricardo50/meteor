import Sessions from './sessions';
import { Users } from '..';

Sessions.addLinks({
  adminImpersonating: {
    field: 'adminImpersonatingLink',
    collection: Users,
    type: 'one',
    metadata: true,
  },
});
