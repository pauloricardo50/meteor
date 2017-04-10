import AppLayout from '/imports/ui/layouts/AppLayout.jsx';
import _RequestPage from '/imports/ui/pages/user/RequestPage.jsx';
import _PropertyPage from '/imports/ui/pages/user/PropertyPage.jsx';
import _AuctionPage from '/imports/ui/pages/user/AuctionPage.jsx';
import _LenderPickerPage from '/imports/ui/pages/user/LenderPickerPage.jsx';

import {
  userContainer,
  userRequestContainer,
  userBorrowerContainer,
} from './Containers';

export const UserLayout = userContainer(AppLayout);
export const RequestPage = userRequestContainer(_RequestPage);
export const PropertyPage = userRequestContainer(_PropertyPage);
export const AuctionPage = userRequestContainer(_AuctionPage);
export const LenderPickerPage = userRequestContainer(_LenderPickerPage);
