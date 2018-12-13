import MortgageNotes from '.';
import { Borrowers, Properties } from '..';

// If you want to use links, don't forget to import this file in 'core/api/links.js'

MortgageNotes.addLinks({
  borrowers: {
    collection: Borrowers,
    inversedBy: 'mortgageNotes',
  },
  properties: {
    collection: Properties,
    inversedBy: 'mortgageNotes',
  },
});
