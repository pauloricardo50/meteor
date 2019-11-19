// @flow
import PasswordResetPage from 'core/components/PasswordResetPage/loadable';
import EmailVerificationPage from 'core/components/EmailVerificationPage/loadable';
import AccountPage from 'core/components/AccountPage/loadable';
import { IMPERSONATE_ROUTE } from 'core/api/impersonation/impersonation';
import ImpersonatePage from 'core/components/Impersonate/ImpersonatePage/loadable';
import NotFound from 'core/components/NotFound/loadable';
import DevPage from 'core/components/DevPage/loadable';
import ProDashboardPage from '../../client/pages/ProDashboardPage/loadable';
import ProOrganisationPage from '../../client/pages/ProOrganisationPage/loadable';
import ProPromotionPage from '../../client/pages/ProPromotionPage/loadable';
import ProPromotionUsersPage from '../../client/pages/ProPromotionUsersPage/loadable';
import ProProPropertyPage from '../../client/pages/ProProPropertyPage/loadable';
import ProRevenuesPage from '../../client/pages/ProRevenuesPage/loadable';

const PRO_ROUTES = {
  PRO_PROMOTION_USERS_PAGE: {
    component: ProPromotionUsersPage,
    path: '/promotions/:promotionId/users',
  },
  PRO_PROMOTION_PAGE: {
    component: ProPromotionPage,
    path: '/promotions/:promotionId/:tabId?',
  },
  PRO_PROPERTY_PAGE: {
    component: ProProPropertyPage,
    path: '/properties/:propertyId',
  },
  PRO_ORGANISATION_PAGE: {
    component: ProOrganisationPage,
    path: '/organisation/:tabId?',
  },
  PRO_REVENUES_PAGE: { component: ProRevenuesPage, path: '/revenues' },

  //   Meteor Accounts pages
  EMAIL_VERIFICATION_PAGE: {
    component: EmailVerificationPage,
    path: '/verify-email/:token',
  },
  ENROLL_ACCOUNT_PAGE: {
    component: PasswordResetPage,
    path: '/enroll-account/:token',
  },
  PASSWORD_RESET_PAGE: {
    component: PasswordResetPage,
    path: '/reset-password/:token',
  },

  // Other
  ACCOUNT_PAGE: { component: AccountPage, path: '/account' },
  DEV_PAGE: { component: DevPage, path: '/dev' },
  IMPERSONATE_PAGE: { component: ImpersonatePage, path: IMPERSONATE_ROUTE },
  PRO_DASHBOARD_PAGE: {
    component: ProDashboardPage,
    path: '/:tabId?',
  },

  // Not found
  NOT_FOUND: { component: NotFound },
};

export default PRO_ROUTES;
