import { merge } from '@storybook/react-komposer';

import Loading from '../components/Loading';
import composeWithTracker from './composers/composeWithTracker';
import { currentUserComposer } from './composers/GeneralComposers';
import {
  userCompareComposer,
  userLoansComposer,
  userBorrowersComposer,
  userOffersComposer,
  userLoanComposer,
  userBorrowerComposer,
  userPropertiesComposer,
} from './composers/UserComposers';
import {
  adminLoansComposer,
  adminLoanComposer,
  adminUsersComposer,
  adminUserComposer,
  adminOffersComposer,
  adminOfferComposer,
  adminPropertiesComposer,
} from './composers/AdminComposers';
import {
  partnerLoansComposer,
  partnerLoanComposer,
  partnerOffersComposer,
  partnerOfferComposer,
} from './composers/PartnerComposers';

// Basic container
export const generalContainer = c =>
  merge(composeWithTracker(currentUserComposer, { loadingHandler: Loading }))(c);

// User containers
export const userContainer = c =>
  merge(
    composeWithTracker(userLoansComposer, { loadingHandler: Loading }),
    composeWithTracker(userBorrowersComposer, { loadingHandler: Loading }),
    composeWithTracker(userPropertiesComposer, { loadingHandler: Loading }),
    composeWithTracker(userOffersComposer, { loadingHandler: Loading }),
    composeWithTracker(currentUserComposer, { loadingHandler: Loading }),
    composeWithTracker(userCompareComposer, { loadingHandler: Loading }),
  )(c);

// export const userLoanContainer = c =>
//   merge(
//     composeWithTracker(userLoanComposer),
//     composeWithTracker(currentUserComposer),
//   )(c);
//
// export const userBorrowerContainer = c =>
//   merge(
//     composeWithTracker(userBorrowerComposer, { loadingHandler: Loading }),
//     composeWithTracker(currentUserComposer, { loadingHandler: Loading }),
//   )(c);

export const userCompareContainer = c =>
  merge(
    composeWithTracker(userCompareComposer, { loadingHandler: Loading }),
    composeWithTracker(currentUserComposer, { loadingHandler: Loading }),
  )(c);

// Admin containers
export const adminContainer = c =>
  merge(
    composeWithTracker(adminLoansComposer),
    composeWithTracker(adminUsersComposer),
    composeWithTracker(adminOffersComposer),
    composeWithTracker(adminPropertiesComposer),
    composeWithTracker(currentUserComposer, { loadingHandler: Loading }),
  )(c);

export const adminUserContainer = c =>
  merge(
    composeWithTracker(adminUserComposer),
    composeWithTracker(currentUserComposer),
  )(c);

export const adminLoanContainer = c =>
  merge(
    composeWithTracker(adminLoanComposer),
    composeWithTracker(currentUserComposer),
  )(c);

export const adminOfferContainer = c =>
  merge(
    composeWithTracker(adminOfferComposer),
    composeWithTracker(currentUserComposer),
  )(c);

// Partner containers
export const partnerContainer = c =>
  merge(
    composeWithTracker(partnerLoansComposer),
    composeWithTracker(partnerOffersComposer),
    composeWithTracker(currentUserComposer, { loadingHandler: Loading }),
  )(c);

export const partnerOfferContainer = c =>
  merge(
    composeWithTracker(partnerOfferComposer),
    composeWithTracker(currentUserComposer),
  )(c);

export const partnerLoanContainer = c =>
  merge(
    composeWithTracker(partnerLoanComposer),
    composeWithTracker(currentUserComposer),
  )(c);
