import Borrowers from '../borrowers';
import Properties from '../properties';
import MortgageNotes from '.';

// If you want to use links, don't forget to import this file in 'core/api/links.js'

MortgageNotes.addLinks({
  borrower: {
    collection: Borrowers,
    inversedBy: 'mortgageNotes',
  },
  property: {
    collection: Properties,
    inversedBy: 'mortgageNotes',
  },
});
