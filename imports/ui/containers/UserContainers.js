import AppLayout from '/imports/ui/layouts/AppLayout.jsx';
import _Borrowerpage from '/imports/ui/pages/user/BorrowerPage.jsx';

import {
  userContainer,
  userRequestContainer,
  userBorrowerContainer,
} from './Containers';

export const UserLayout = userContainer(AppLayout);
export const BorrowerPage = userBorrowerContainer(_Borrowerpage);
