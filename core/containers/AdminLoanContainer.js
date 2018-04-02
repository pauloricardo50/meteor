import { merge } from '@storybook/react-komposer';
import composeWithTracker from './composers/composeWithTracker';
import Loading from '../components/Loading';

import { currentUserComposer } from './composers/GeneralComposers';
import { adminLoanComposer } from './composers/AdminComposers';

const AdminLoanContainer = component =>
  merge(
    composeWithTracker(adminLoanComposer, { loadingHandler: Loading }),
    composeWithTracker(currentUserComposer, { loadingHandler: Loading }),
  )(component);

export default AdminLoanContainer;
