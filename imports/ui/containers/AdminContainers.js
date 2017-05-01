import _AppLayout from '/imports/ui/layouts/AppLayout.jsx';
import _OfferPage from '/imports/ui/pages/admin/OfferPage.jsx';
import _SingleRequestPage from '/imports/ui/pages/admin/SingleRequestPage.jsx';
import _SingleUserPage from '/imports/ui/pages/admin/SingleUserPage.jsx';
import _VerifyPage from '/imports/ui/pages/admin/VerifyPage.jsx';

import {
  adminContainer,
  adminUserContainer,
  adminRequestContainer,
  adminOfferContainer,
} from './Containers';

export const AdminLayout = adminContainer(_AppLayout);
export const OfferPage = adminOfferContainer(_OfferPage);
export const SingleRequestPage = adminRequestContainer(_SingleRequestPage);
export const SingleUserPage = adminUserContainer(_SingleUserPage);
export const VerifyPage = adminUserContainer(_VerifyPage);
