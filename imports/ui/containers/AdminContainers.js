import _AppLayout from '/imports/ui/layouts/AppLayout.jsx';
import _AdminOfferPage from '/imports/ui/pages/admin/AdminOfferPage.jsx';
import _AdminSingleRequestPage from '/imports/ui/pages/admin/AdminSingleRequestPage.jsx';
import _AdminSingleUserPage from '/imports/ui/pages/admin/AdminSingleUserPage.jsx';

import {
  adminContainer,
  adminUserContainer,
  adminRequestContainer,
  adminOfferContainer,
} from './Containers';

export const AdminLayout = adminContainer(_AppLayout);
export const AdminOfferPage = adminOfferContainer(_AdminOfferPage);
export const AdminSingleRequestPage = adminRequestContainer(_AdminSingleRequestPage);
export const AdminSingleUserPage = adminUserContainer(_AdminSingleUserPage);
