import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const getGpsStats = new Method({
  name: 'getGpsStats',
  params: {
    romandyOnly: Match.Optional(Boolean),
  },
});
