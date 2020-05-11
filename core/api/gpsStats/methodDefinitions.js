import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const getGpsStats = new Method({
  name: 'getGpsStats',
  params: {
    cantons: Array,
  },
});

export const getCitiesFromZipCode = new Method({
  name: 'getCitiesFromZipCode',
  params: {
    zipCode: Match.OneOf(String, Number),
  },
});
