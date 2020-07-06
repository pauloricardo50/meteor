import Borrowers from '../borrowers';
import LinkInitializer from '../links/LinkInitializer';
import Properties from '../properties';
import MortgageNotes from '.';

// If you want to use links, don't forget to import this file in 'core/api/links.js'

LinkInitializer.inversedInit(() => {
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
});
