import { IMPERSONATE_ROUTE } from 'core/api/impersonation/impersonation';
import DevPage from 'core/components/DevPage/loadable';
import EmailVerificationPage from 'core/components/EmailVerificationPage/loadable';
import ImpersonatePage from 'core/components/Impersonate/ImpersonatePage/loadable';
import NotFound from 'core/components/NotFound/loadable';
import PasswordResetPage from 'core/components/PasswordResetPage/loadable';

import AppAccountPage from '../../client/pages/AppAccountPage/loadable';
import AppPage from '../../client/pages/AppPage';
import AppPromotionPage from '../../client/pages/AppPromotionPage/loadable';
import AppWidget1Page from '../../client/pages/AppWidget1Page/loadable';
import BorrowersPage from '../../client/pages/BorrowersPage/loadable';
import DashboardPage from '../../client/pages/DashboardPage/loadable';
import FilesPage from '../../client/pages/FilesPage/loadable';
import FinancingPage from '../../client/pages/FinancingPage/loadable';
import PropertiesPage from '../../client/pages/PropertiesPage/loadable';
import RefinancingPage from '../../client/pages/RefinancingPage/RefinancingPage';
import SignupSuccessPage from '../../client/pages/SignupSuccessPage/loadable';
import SinglePropertyPage from '../../client/pages/SinglePropertyPage/loadable';
import SolvencyPage from '../../client/pages/SolvencyPage/loadable';
import WelcomePage from '../../client/pages/WelcomePage/loadable';

export default {
  REFINANCING_PAGE: {
    path: '/loans/:loanId/refinancing',
    component: RefinancingPage,
  },
  ACCOUNT_PAGE: { path: '/account', component: AppAccountPage },
  APP_WIDGET1_PAGE: {
    path: '/loans/:loanId/widget1',
    component: AppWidget1Page,
  },
  BORROWERS_PAGE: {
    path: '/loans/:loanId/borrowers/:tabId',
    component: BorrowersPage,
  },
  BORROWERS_PAGE_NO_TAB: {
    path: '/loans/:loanId/borrowers',
    component: BorrowersPage,
  },
  DEV_PAGE: { path: '/dev', component: DevPage },
  FILES_PAGE: {
    path: '/loans/:loanId/files',
    component: FilesPage,
  },
  FINANCING_PAGE: {
    path: '/loans/:loanId/financing',
    component: FinancingPage,
  },
  PROPERTY_PAGE: {
    path: '/loans/:loanId/properties/:propertyId',
    component: SinglePropertyPage,
  },
  PROPERTIES_PAGE: {
    path: '/loans/:loanId/properties',
    component: PropertiesPage,
  },
  APP_PROMOTION_PAGE: {
    path: '/loans/:loanId/promotions/:promotionId/:tabId?',
    component: AppPromotionPage,
  },
  WELCOME_PAGE: {
    path: '/loans/:loanId/welcome',
    component: WelcomePage,
  },
  SOLVENCY_PAGE: {
    path: '/loans/:loanId/solvency',
    component: SolvencyPage,
  },
  DASHBOARD_PAGE: {
    path: '/loans/:loanId',
    component: DashboardPage,
  },
  SIGNUP_SUCCESS_PAGE: {
    path: '/signup/:email',
    component: SignupSuccessPage,
  },
  PASSWORD_RESET_PAGE: {
    path: '/reset-password/:token',
    component: PasswordResetPage,
  },
  ENROLL_ACCOUNT_PAGE: {
    path: '/enroll-account/:token',
    component: PasswordResetPage,
  },
  EMAIL_VERIFICATION_PAGE: {
    path: '/verify-email/:token',
    component: EmailVerificationPage,
  },
  APP_PAGE: {
    path: '/',
    component: AppPage,
    exact: true,
  },
  IMPERSONATE: {
    path: IMPERSONATE_ROUTE,
    component: ImpersonatePage,
    exact: true,
    logoutOnMount: true,
  },
  NOT_FOUND: {
    component: NotFound,
  },
};
