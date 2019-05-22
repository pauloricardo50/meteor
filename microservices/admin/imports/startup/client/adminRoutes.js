// @flow
import NotFound from 'core/components/NotFound/loadable';
import DevPage from 'core/components/DevPage/loadable';

import AdminAccountPage from '../../client/pages/AdminAccountPage/loadable';
import AdminDashboardPage from '../../client/pages/AdminDashboardPage/loadable';
import AdminPromotionLotPage from '../../client/pages/AdminPromotionLotPage/loadable';
import AdminPromotionPage from '../../client/pages/AdminPromotionPage/loadable';
import AdminPromotionUsersPage from '../../client/pages/AdminPromotionUsersPage/loadable';
import BorrowersPage from '../../client/pages/BorrowersPage/loadable';
import ContactsPage from '../../client/pages/ContactsPage/loadable';
import InterestRatesPage from '../../client/pages/InterestRatesPage/loadable';
import LoansPage from '../../client/pages/LoansPage/loadable';
import OrganisationsPage from '../../client/pages/OrganisationsPage/loadable';
import PromotionsPage from '../../client/pages/PromotionsPage/loadable';
import PropertiesPage from '../../client/pages/PropertiesPage/loadable';
import SingleBorrowerPage from '../../client/pages/SingleBorrowerPage/loadable';
import SingleContactPage from '../../client/pages/SingleContactPage/loadable';
import SingleLoanPage from '../../client/pages/SingleLoanPage/loadable';
import SingleOrganisationPage from '../../client/pages/SingleOrganisationPage/loadable';
import SinglePropertyPage from '../../client/pages/SinglePropertyPage/loadable';
import SingleUserPage from '../../client/pages/SingleUserPage/loadable';
import TasksPage from '../../client/pages/TasksPage/loadable';
import UsersPage from '../../client/pages/UsersPage/loadable';

const ADMIN_ROUTES = {
  DASHBOARD_PAGE: { component: AdminDashboardPage, path: '/', exact: true },

  //   "All" pages
  USERS_PAGE: { component: UsersPage, path: '/users', exact: true },
  LOANS_PAGE: { component: LoansPage, path: '/loans', exact: true },
  BORROWERS_PAGE: { component: BorrowersPage, path: '/borrowers', exact: true },
  CONTACTS_PAGE: { component: ContactsPage, path: '/contacts', exact: true },
  ORGANISATIONS_PAGE: {
    component: OrganisationsPage,
    path: '/organisations',
    exact: true,
  },
  PROMOTIONS_PAGE: {
    component: PromotionsPage,
    path: '/promotions',
    exact: true,
  },
  PROPERTIES_PAGE: {
    component: PropertiesPage,
    path: '/properties',
    exact: true,
  },
  TASKS_PAGE: { component: TasksPage, path: '/tasks', exact: true },
  INTEREST_RATES_PAGE: {
    component: InterestRatesPage,
    path: '/interestRates',
    exact: true,
  },

  //   "Single" pages
  SINGLE_BORROWER_PAGE: {
    component: SingleBorrowerPage,
    path: '/borrowers/:borrowerId',
  },
  SINGLE_CONTACT_PAGE: {
    component: SingleContactPage,
    path: '/contacts/:contactId',
  },
  SINGLE_LOAN_PAGE: {
    component: SingleLoanPage,
    path: '/loans/:loanId/:tabId?',
  },
  SINGLE_ORGANISATION_PAGE: {
    component: SingleOrganisationPage,
    path: '/organisations/:organisationId/:tabId?',
  },
  SINGLE_PROPERTY_PAGE: {
    component: SinglePropertyPage,
    path: '/properties/:propertyId',
    className: 'card1 card-top',
  },
  SINGLE_USER_PAGE: { component: SingleUserPage, path: '/users/:userId' },
  ADMIN_PROMOTION_LOT_PAGE: {
    component: AdminPromotionLotPage,
    path: '/promotions/:promotionId/promotionLots/:promotionLotId',
  },
  ADMIN_PROMOTION_USERS_PAGE: {
    component: AdminPromotionUsersPage,
    path: '/promotions/:promotionId/users',
  },
  ADMIN_PROMOTION_PAGE: {
    component: AdminPromotionPage,
    path: '/promotions/:promotionId',
  },

  //   Other
  ACCOUNT_PAGE: { component: AdminAccountPage, path: '/account' },
  DEV_PAGE: { component: DevPage, path: '/dev' },
  NOT_FOUND: { component: NotFound },
};

export default ADMIN_ROUTES;
