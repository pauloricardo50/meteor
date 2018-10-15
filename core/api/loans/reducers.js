import omit from 'lodash/omit';
import Loans from '.';
import { userPropertyFragment } from '../properties/queries/propertyFragments';
import { fullOfferFragment } from '../offers/queries/offerFragments';
import { formatLoanWithStructure } from '../../utils/loanFunctions';

Loans.addReducers({
  structure: {
    body: {
      selectedStructure: 1,
      structures: 1,
      properties: omit(userPropertyFragment, ['loans', '$options', 'user']),
      offers: omit(fullOfferFragment, ['loans', '$options', 'user']),
    },
    reduce: formatLoanWithStructure,
  },
  hasPromotion: {
    body: {
      promotionLinks: 1,
    },
    reduce: ({ promotionLinks }) => promotionLinks && promotionLinks.length > 0,
  },
});
