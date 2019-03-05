import Revenues from '.';
import { Loans } from '..';

// If you want to use links, don't forget to import this file in 'core/api/links.js'

Revenues.addLinks({
  loan: {
    collection: Loans,
    inversedBy: 'revenues',
    type: 'one',
  },
});
