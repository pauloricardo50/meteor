import Organisations from './organisations';
import { Offers, Partners } from '..';

Organisations.addLinks({
  offers: {
    collection: Offers,
    inversedBy: 'organisation',
  },
  partners: {
    collection: Partners,
    field: 'partnerIds',
    type: 'many',
    metadata: true,
  },
});
