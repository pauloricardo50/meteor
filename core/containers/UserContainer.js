import { merge } from '@storybook/react-komposer';
import composeWithTracker from './composers/composeWithTracker';
import Loading from '../components/Loading';

import {
  // userCompareComposer,
  userRequestsComposer,
  userBorrowersComposer,
  userOffersComposer,
  userPropertiesComposer,
} from './composers/UserComposers';
import { currentUserComposer } from './composers/GeneralComposers';

const UserContainer = component =>
  merge(
    composeWithTracker(userRequestsComposer, Loading),
    composeWithTracker(userBorrowersComposer, Loading),
    composeWithTracker(userOffersComposer, Loading),
    composeWithTracker(userPropertiesComposer, Loading),
    composeWithTracker(currentUserComposer, Loading),
    // composeWithTracker(userCompareComposer, Loading),
  )(component);

export default UserContainer;
