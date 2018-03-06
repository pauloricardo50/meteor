import { Properties, Users } from '../';

Properties.addLinks({
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
});
