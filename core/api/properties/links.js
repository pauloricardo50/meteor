import { Properties, Users } from '../';

Properties.addLinks({
  propertyAsignee: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
});
