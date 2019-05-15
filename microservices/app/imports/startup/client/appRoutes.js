import DevPage from 'core/components/DevPage/loadable';
import PasswordResetPage from 'core/components/PasswordResetPage/loadable';
import EmailVerificationPage from 'core/components/EmailVerificationPage/loadable';
import ImpersonatePage from 'core/components/Impersonate/ImpersonatePage/loadable';
import { IMPERSONATE_ROUTE } from 'core/api/impersonation/impersonation';
import NotFound from 'core/components/NotFound/loadable';
import RefinancingPage from '../../client/pages/RefinancingPage/RefinancingPage';
import AppAccountPage from '../../client/pages/AppAccountPage/loadable';
import AppWidget1Page from '../../client/pages/AppWidget1Page/loadable';
import BorrowersPage from '../../client/pages/BorrowersPage/loadable';
import FilesPage from '../../client/pages/FilesPage/loadable';
import FinancingPage from '../../client/pages/FinancingPage/loadable';
import SinglePropertyPage from '../../client/pages/SinglePropertyPage/loadable';
import PropertiesPage from '../../client/pages/PropertiesPage/loadable';
import AppPromotionLotPage from '../../client/pages/AppPromotionLotPage/loadable';
import AppPromotionOptionPage from '../../client/pages/AppPromotionOptionPage/loadable';
import AppPromotionPage from '../../client/pages/AppPromotionPage/loadable';
import WelcomePage from '../../client/pages/WelcomePage/loadable';
import SolvencyPage from '../../client/pages/SolvencyPage/loadable';
import DashboardPage from '../../client/pages/DashboardPage/loadable';
import SignupSuccessPage from '../../client/pages/SignupSuccessPage/loadable';
import AppPage from '../../client/pages/AppPage/loadable';

// @flow
// export const ACCOUNT_PAGE = '/account';
// export const ADD_LOAN_PAGE = '/add-loan/:loanId';
// export const APP_PAGE = '/';
// export const APP_PROMOTION_LOT_PAGE = '/loans/:loanId/promotions/:promotionId/promotionLots/:promotionLotId';
// export const APP_PROMOTION_OPTION_PAGE = '/loans/:loanId/promotions/:promotionId/promotionOptions/:promotionOptionId';
// export const APP_PROMOTION_PAGE = '/loans/:loanId/promotions/:promotionId';
// export const APP_WIDGET1_PAGE = '/loans/:loanId/widget1';
// export const BORROWERS_PAGE_NO_TAB = '/loans/:loanId/borrowers';
// export const BORROWERS_PAGE = `${BORROWERS_PAGE_NO_TAB}/:tabId`;
// export const DASHBOARD_PAGE = '/loans/:loanId';
// export const DEV_PAGE = '/dev';
// export const EMAIL_VERIFICATION_PAGE = '/verify-email/:token';
// export const ENROLL_ACCOUNT_PAGE = '/enroll-account/:token';
// export const FILES_PAGE = '/loans/:loanId/files';
// export const FINANCING_PAGE = '/loans/:loanId/financing';
// export const PASSWORD_RESET_PAGE = '/reset-password/:token';
// export const PROPERTIES_PAGE = '/loans/:loanId/properties';
// export const PROPERTY_PAGE = '/loans/:loanId/properties/:propertyId';
// export const REFINANCING_PAGE = '/loans/:loanId/refinancing';
// export const WELCOME_PAGE = '/loans/:loanId/welcome';
// export const SOLVENCY_PAGE = '/loans/:loanId/solvency';
// export const SIGNUP_SUCCESS_PAGE = '/signup/:email';

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
  APP_PROMOTION_LOT_PAGE: {
    path:
      '/loans/:loanId/promotions/:promotionId/promotionLots/:promotionLotId',
    component: AppPromotionLotPage,
  },
  APP_PROMOTION_OPTION_PAGE: {
    path:
      '/loans/:loanId/promotions/:promotionId/promotionOptions/:promotionOptionId',
    component: AppPromotionOptionPage,
  },
  APP_PROMOTION_PAGE: {
    path: '/loans/:loanId/promotions/:promotionId',
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
  },
  NOT_FOUND: {
    component: NotFound,
  },
};
