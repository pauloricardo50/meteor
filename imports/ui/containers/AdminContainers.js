import _AppLayout from '/imports/ui/layouts/AppLayout.jsx';
import _AdminDashboardPage from '/imports/ui/pages/admin/AdminDashboardPage.jsx';
import _UsersPage from '/imports/ui/pages/admin/UsersPage.jsx';
import _RequestsPage from '/imports/ui/pages/admin/RequestsPage.jsx';
import _OfferPage from '/imports/ui/pages/admin/OfferPage.jsx';
import _SingleRequestPage from '/imports/ui/pages/admin/SingleRequestPage.jsx';
import _SingleUserPage from '/imports/ui/pages/admin/SingleUserPage.jsx';
import _VerifyPage from '/imports/ui/pages/admin/VerifyPage.jsx';
import _ContactLendersPage from '/imports/ui/pages/admin/ContactLendersPage.jsx';

import {
  generalContainer,
  adminContainer,
  adminUserContainer,
  adminRequestContainer,
  adminOfferContainer,
} from './Containers';

export const AdminLayout = generalContainer(_AppLayout);
export const AdminDashboardPage = adminContainer(_AdminDashboardPage);
export const UsersPage = adminContainer(_UsersPage);
export const RequestsPage = adminContainer(_RequestsPage);
export const OfferPage = adminOfferContainer(_OfferPage);
export const SingleRequestPage = adminRequestContainer(_SingleRequestPage);
export const SingleUserPage = adminUserContainer(_SingleUserPage);
export const VerifyPage = adminRequestContainer(_VerifyPage);
export const ContactLendersPage = adminRequestContainer(_ContactLendersPage);
