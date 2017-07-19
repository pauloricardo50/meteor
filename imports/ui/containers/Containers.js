import { merge } from 'react-komposer';

import Loading from '/imports/ui/components/general/Loading.jsx';
import composeWithTracker from '/imports/ui/containers/composers/composeWithTracker';

import { currentUserComposer } from './composers/GeneralComposers';
import {
  userCompareComposer,
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
  adminActionsComposer,
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
  merge(composeWithTracker(currentUserComposer, Loading))(c);

// User containers
export const userContainer = c =>
  merge(
    composeWithTracker(userRequestsComposer, Loading),
    composeWithTracker(userBorrowersComposer, Loading),
    composeWithTracker(userOffersComposer, Loading),
    composeWithTracker(currentUserComposer, Loading),
  )(c);

export const userRequestContainer = c =>
  merge(
    composeWithTracker(userRequestComposer),
    composeWithTracker(currentUserComposer),
  )(c);

export const userBorrowerContainer = c =>
  merge(
    composeWithTracker(userBorrowerComposer, Loading),
    composeWithTracker(currentUserComposer, Loading),
  )(c);

export const userCompareContainer = c =>
  merge(
    composeWithTracker(userCompareComposer, Loading),
    composeWithTracker(currentUserComposer, Loading),
  )(c);

// Admin containers
export const adminContainer = c =>
  merge(
    composeWithTracker(adminRequestsComposer),
    composeWithTracker(adminUsersComposer),
    composeWithTracker(adminOffersComposer),
    composeWithTracker(adminActionsComposer),
    composeWithTracker(currentUserComposer, Loading),
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
    composeWithTracker(adminActionsComposer),
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
    composeWithTracker(currentUserComposer, Loading),
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
