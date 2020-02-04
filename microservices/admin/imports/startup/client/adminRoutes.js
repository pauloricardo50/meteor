//      
import NotFound from 'core/components/NotFound/loadable';
import DevPage from 'core/components/DevPage/loadable';

import AdminAccountPage from '../../client/pages/AdminAccountPage/loadable';
import AdminDashboardPage from '../../client/pages/AdminDashboardPage/loadable';
import AdminPromotionPage from '../../client/pages/AdminPromotionPage/loadable';
import LoansPage from '../../client/pages/LoansPage/loadable';
import OrganisationsPage from '../../client/pages/OrganisationsPage/loadable';
import PromotionsPage from '../../client/pages/PromotionsPage/loadable';
import SingleBorrowerPage from '../../client/pages/SingleBorrowerPage/loadable';
import SingleContactPage from '../../client/pages/SingleContactPage/loadable';
import SingleLoanPage from '../../client/pages/SingleLoanPage/loadable';
import SingleOrganisationPage from '../../client/pages/SingleOrganisationPage/loadable';
import SinglePropertyPage from '../../client/pages/SinglePropertyPage/loadable';
import SingleUserPage from '../../client/pages/SingleUserPage/loadable';
import UsersPage from '../../client/pages/UsersPage/loadable';
import LoanBoardPage from '../../client/pages/LoanBoardPage/loadable';
import RevenuesPage from '../../client/pages/RevenuesPage/loadable';
import OtherPage from '../../client/pages/OtherPage/loadable';
import WikiPage from '../../client/pages/WikiPage/loadable';

const ADMIN_ROUTES = {
  DASHBOARD_PAGE: { component: AdminDashboardPage, path: '/', exact: true },
  LOAN_BOARD_PAGE: {
    component: LoanBoardPage,
    path: '/loan-board',
    exact: true,
  },

  //   "All" pages
  USERS_PAGE: { component: UsersPage, path: '/users', exact: true },
  LOANS_PAGE: { component: LoansPage, path: '/loans', exact: true },
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
  REVENUES_PAGE: {
    component: RevenuesPage,
    path: '/revenues/:tabId?/:revenuesTabId?',
  },
  OTHER_PAGE: {
    component: OtherPage,
    path: '/other/:tabId?',
  },
  WIKI_PAGE: {
    component: WikiPage,
    path: '/wiki/:tabId?',
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
    enableTabRouting: true,
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
  ADMIN_PROMOTION_PAGE: {
    component: AdminPromotionPage,
    path: '/promotions/:promotionId/:tabId?',
  },

  //   Other
  ACCOUNT_PAGE: { component: AdminAccountPage, path: '/account' },
  DEV_PAGE: { component: DevPage, path: '/dev' },
  NOT_FOUND: { component: NotFound },
};

export default ADMIN_ROUTES;
