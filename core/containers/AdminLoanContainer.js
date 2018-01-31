import { merge } from '@storybook/react-komposer';
import composeWithTracker from './composers/composeWithTracker';
import Loading from '../components/Loading';

import { currentUserComposer } from './composers/GeneralComposers';
import {
  adminLoanComposer,
  adminActionsComposer,
} from './composers/AdminComposers';

const AdminLoanContainer = component =>
  merge(
    composeWithTracker(adminLoanComposer, Loading),
    composeWithTracker(currentUserComposer, Loading),
    composeWithTracker(adminActionsComposer, Loading),
  )(component);

export default AdminLoanContainer;
