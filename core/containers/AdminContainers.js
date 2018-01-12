import _AppLayout from '/imports/ui/layouts/AdminLayout';
import _AdminDashboardPage from '/imports/ui/pages/AdminDashboardPage';
import _UsersPage from '/imports/ui/pages/UsersPage';
import _RequestsPage from '/imports/ui/pages/RequestsPage';
import _OfferPage from '/imports/ui/pages/OfferPage';
import _SingleRequestPage from '/imports/ui/pages/SingleRequestPage';
import _SingleUserPage from '/imports/ui/pages/SingleUserPage';
import _VerifyPage from '/imports/ui/pages/VerifyPage';
import _ContactLendersPage from '/imports/ui/pages/ContactLendersPage';

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
