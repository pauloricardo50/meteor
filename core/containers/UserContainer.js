import { merge } from '@storybook/react-komposer';
import composeWithTracker from './composers/composeWithTracker';
import Loading from '../components/Loading';

import {
  // userCompareComposer,
  userLoansComposer,
  userBorrowersComposer,
  userOffersComposer,
  userPropertiesComposer,
} from './composers/UserComposers';
import { currentUserComposer } from './composers/GeneralComposers';

const UserContainer = component =>
  merge(
    composeWithTracker(userLoansComposer, { loadingHandler: Loading }),
    composeWithTracker(userBorrowersComposer, { loadingHandler: Loading }),
    composeWithTracker(userOffersComposer, { loadingHandler: Loading }),
    composeWithTracker(userPropertiesComposer, { loadingHandler: Loading }),
    composeWithTracker(currentUserComposer, { loadingHandler: Loading }),
    // composeWithTracker(userCompareComposer, { loadingHandler: Loading }),
  )(component);

export default UserContainer;
