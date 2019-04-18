import React from 'react';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound/loadable';
import { getUserLocale, getFormats } from 'core/utils/localization';
import DevPage from 'core/components/DevPage/loadable';

import messagesFR from '../../../lang/fr.json';

import AdminAccountPage from '../../client/pages/AdminAccountPage';
import AdminDashboardPage from '../../client/pages/AdminDashboardPage';
import AdminLayout from '../../client/layouts/AdminLayout';
import AdminPromotionLotPage from '../../client/pages/AdminPromotionLotPage';
import AdminPromotionPage from '../../client/pages/AdminPromotionPage';
import AdminPromotionUsersPage from '../../client/pages/AdminPromotionUsersPage';
import BorrowersPage from '../../client/pages/BorrowersPage';
import ContactsPage from '../../client/pages/ContactsPage';
import InterestRatesPage from '../../client/pages/InterestRatesPage';
import LoansPage from '../../client/pages/LoansPage';
import OrganisationsPage from '../../client/pages/OrganisationsPage';
import PromotionsPage from '../../client/pages/PromotionsPage';
import PropertiesPage from '../../client/pages/PropertiesPage';
import SearchPage from '../../client/pages/SearchPage';
import SingleBorrowerPage from '../../client/pages/SingleBorrowerPage';
import SingleContactPage from '../../client/pages/SingleContactPage';
import SingleLoanPage from '../../client/pages/SingleLoanPage';
import SingleOrganisationPage from '../../client/pages/SingleOrganisationPage';
import SinglePropertyPage from '../../client/pages/SinglePropertyPage';
import SingleUserPage from '../../client/pages/SingleUserPage';
import TasksPage from '../../client/pages/TasksPage';
import UsersPage from '../../client/pages/UsersPage';
import AdminStore from '../../client/components/AdminStore';

import * as adminRoutes from './adminRoutes';

const AdminRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    WrapperComponent={AdminStore}
  >
    <AdminLayout type="admin">
      <Switch>
        <Route
          exact
          path={adminRoutes.DASHBOARD_PAGE}
          component={AdminDashboardPage}
        />
        <Route exact path={adminRoutes.USERS_PAGE} component={UsersPage} />
        <Route exact path={adminRoutes.LOANS_PAGE} component={LoansPage} />
        <Route path={adminRoutes.SINGLE_LOAN_PAGE} component={SingleLoanPage} />
        <Route path={adminRoutes.SINGLE_USER_PAGE} component={SingleUserPage} />
        <Route
          path={adminRoutes.SINGLE_PROPERTY_PAGE}
          component={SinglePropertyPage}
          className="card1 card-top"
        />
        <Route
          path={adminRoutes.ADMIN_PROMOTION_USERS_PAGE}
          component={AdminPromotionUsersPage}
        />
        <Route
          path={adminRoutes.ADMIN_PROMOTION_LOT_PAGE}
          component={AdminPromotionLotPage}
        />
        <Route
          path={adminRoutes.ADMIN_PROMOTION_PAGE}
          component={AdminPromotionPage}
        />
        <Route path={adminRoutes.PROPERTIES_PAGE} component={PropertiesPage} />
        <Route path={adminRoutes.TASKS_PAGE} component={TasksPage} />
        <Route
          path={adminRoutes.SINGLE_BORROWER_PAGE}
          component={SingleBorrowerPage}
        />
        <Route path={adminRoutes.BORROWERS_PAGE} component={BorrowersPage} />
        <Route path={adminRoutes.PROMOTIONS_PAGE} component={PromotionsPage} />
        <Route path={adminRoutes.SEARCH_PAGE} component={SearchPage} />
        <Route path={adminRoutes.ACCOUNT_PAGE} component={AdminAccountPage} />
        <Route
          path={adminRoutes.SINGLE_ORGANISATION_PAGE}
          component={SingleOrganisationPage}
        />
        <Route
          path={adminRoutes.ORGANISATIONS_PAGE}
          component={OrganisationsPage}
        />
        <Route
          path={adminRoutes.INTEREST_RATES_PAGE}
          component={InterestRatesPage}
        />
        <Route
          path={adminRoutes.SINGLE_CONTACT_PAGE}
          component={SingleContactPage}
        />
        <Route path={adminRoutes.CONTACTS_PAGE} component={ContactsPage} />
        <Route path={adminRoutes.DEV_PAGE} component={DevPage} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  </BaseRouter>
);

export default AdminRouter;
