import Lots from '.';

import { Promotions } from '..';

Lots.addLinks({
  promotions: {
    collection: Promotions,
    inversedBy: 'lots',
  },
});
