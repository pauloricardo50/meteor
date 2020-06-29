import LinkInitializer from '../links/LinkInitializer';
import Loans from '../loans';
import Checklists from './checklists';

LinkInitializer.inversedInit(() => {
  Checklists.addLinks({
    closingLoan: {
      collection: Loans,
      inversedBy: 'closingChecklists',
    },
  });
});
