import { merge } from 'react-komposer';

import Loading from '/imports/ui/components/general/Loading.jsx';

import composeWithTracker
  from '/imports/ui/containers/composers/composeWithTracker';

import { currentUserComposer } from './composers/GeneralComposers';
import {
  userRequestsComposer,
  userBorrowersComposer,
  userOffersComposer,
  userRequestComposer,
  userBorrowerComposer,
} from './composers/UserComposers';
import {
  adminRequestsComposer,
  adminRequestComposer,
  adminUsersComposer,
  adminUserComposer,
  adminOffersComposer,
  adminOfferComposer,
} from './composers/AdminComposers';
import {
  partnerRequestsComposer,
  partnerRequestComposer,
  partnerOffersComposer,
  partnerOfferComposer,
} from './composers/PartnerComposers';

// Basic container
export const generalContainer = c =>
  merge(composeWithTracker(currentUserComposer))(c);

// User containers
export const userContainer = c =>
  merge(
    composeWithTracker(userRequestsComposer),
    composeWithTracker(userBorrowersComposer),
    composeWithTracker(userOffersComposer),
    composeWithTracker(currentUserComposer),
  )(c);
export const userRequestContainer = c =>
  merge(
    composeWithTracker(userRequestComposer),
    composeWithTracker(currentUserComposer),
  )(c);
export const userBorrowerContainer = c =>
  merge(
    composeWithTracker(userBorrowerComposer),
    composeWithTracker(currentUserComposer),
  )(c);

// Admin containers
export const adminContainer = c =>
  merge(
    composeWithTracker(adminRequestsComposer),
    composeWithTracker(adminUsersComposer),
    composeWithTracker(adminOffersComposer),
    composeWithTracker(currentUserComposer),
  )(c);
export const adminUserContainer = c =>
  merge(
    composeWithTracker(adminUserComposer),
    composeWithTracker(currentUserComposer),
  )(c);
export const adminRequestContainer = c =>
  merge(
    composeWithTracker(adminRequestComposer),
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
    composeWithTracker(partnerRequestsComposer),
    composeWithTracker(partnerOffersComposer),
    composeWithTracker(currentUserComposer),
  )(c);
export const partnerOfferContainer = c =>
  merge(
    composeWithTracker(partnerOfferComposer),
    composeWithTracker(currentUserComposer),
  )(c);
export const partnerRequestContainer = c =>
  merge(
    composeWithTracker(partnerRequestComposer),
    composeWithTracker(currentUserComposer),
  )(c);
