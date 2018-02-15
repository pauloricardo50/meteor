import _AdminLayout from '/imports/ui/layouts/AdminLayout';
import _AdminDashboardPage from '/imports/ui/pages/AdminDashboardPage';
import _UsersPage from '/imports/ui/pages/UsersPage';
import _LoansPage from '/imports/ui/pages/LoansPage';
import _OfferPage from '/imports/ui/pages/OfferPage';
import _SingleLoanPage from '/imports/ui/pages/SingleLoanPage';
import _SingleUserPage from '/imports/ui/pages/SingleUserPage';
import _VerifyPage from '/imports/ui/pages/VerifyPage';
import _ContactLendersPage from '/imports/ui/pages/ContactLendersPage';

import {
  generalContainer,
  adminContainer,
  adminUserContainer,
  adminLoanContainer,
  adminOfferContainer,
} from './Containers';

export const AdminLayout = generalContainer(_AdminLayout);
export const AdminDashboardPage = adminContainer(_AdminDashboardPage);
export const UsersPage = adminContainer(_UsersPage);
export const LoansPage = adminContainer(_LoansPage);
export const OfferPage = adminOfferContainer(_OfferPage);
export const SingleLoanPage = adminLoanContainer(_SingleLoanPage);
export const SingleUserPage = adminUserContainer(_SingleUserPage);
export const VerifyPage = adminLoanContainer(_VerifyPage);
export const ContactLendersPage = adminLoanContainer(_ContactLendersPage);
