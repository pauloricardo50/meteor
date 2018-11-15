import Organisations from './organisations';
import { Offers } from '..';

Organisations.addLinks({
  offers: {
    collection: Offers,
    inversedBy: 'organisation',
  },
});
