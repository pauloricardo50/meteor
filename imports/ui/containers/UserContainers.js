import AppLayout from '/imports/ui/layouts/AppLayout.jsx';
import _BorrowerPage from '/imports/ui/pages/user/BorrowerPage.jsx';
import _RequestPage from '/imports/ui/pages/user/RequestPage.jsx';
import _PropertyPage from '/imports/ui/pages/user/PropertyPage.jsx';

import {
  userContainer,
  userRequestContainer,
  userBorrowerContainer,
} from './Containers';

export const UserLayout = userContainer(AppLayout);
export const BorrowerPage = userBorrowerContainer(_BorrowerPage);
export const RequestPage = userRequestContainer(_RequestPage);
export const PropertyPage = userRequestContainer(_PropertyPage);
