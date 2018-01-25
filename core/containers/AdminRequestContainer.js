import { merge } from '@storybook/react-komposer';
import composeWithTracker from './composers/composeWithTracker';
import Loading from '../components/Loading';

import { currentUserComposer } from './composers/GeneralComposers';
import {
  adminRequestComposer,
  adminActionsComposer,
} from './composers/AdminComposers';

const AdminRequestContainer = component =>
  merge(
    composeWithTracker(adminRequestComposer, Loading),
    composeWithTracker(currentUserComposer, Loading),
    composeWithTracker(adminActionsComposer, Loading),
  )(component);

export default AdminRequestContainer;
