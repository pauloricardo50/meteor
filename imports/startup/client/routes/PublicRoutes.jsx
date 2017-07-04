import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {
  PublicLayout,
  Start2Page,
} from '/imports/ui/containers/PublicContainers';
import HomePage from '/imports/ui/pages/public/HomePage.jsx';
import LoginPage from '/imports/ui/pages/public/LoginPage.jsx';
import AboutPage from '/imports/ui/pages/public/AboutPage.jsx';
import CareersPage from '/imports/ui/pages/public/CareersPage.jsx';
import TosPage from '/imports/ui/pages/public/TosPage.jsx';
import EmailVerificationPage from '/imports/ui/pages/public/EmailVerificationPage.jsx';
import PasswordResetPage from '/imports/ui/pages/public/PasswordResetPage.jsx';
import TestPage from '/imports/ui/pages/public/TestPage.jsx';
import NotFound from '/imports/ui/components/general/NotFound.jsx';

// To be removed
import ComparePage from '/imports/ui/pages/user/ComparePage.jsx';

import Loadable from '/imports/js/helpers/loadable';

const Start1Page = Loadable({
  loader: () => import('/imports/ui/pages/public/Start1Page.jsx'),
});

const PublicRoutes = props =>
  (<PublicLayout {...props}>
    <Switch>
      <Route path="/home" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/start1/:type" component={Start1Page} />
      <Route path="/start2/:type" component={Start2Page} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/tos" component={TosPage} />
      <Route path="/test" component={TestPage} />
      <Route path="/verify-email/:token" component={EmailVerificationPage} />
      <Route path="/reset-password/:token" component={PasswordResetPage} />

      <Route path="/compare" component={ComparePage} />

      <Route component={NotFound} />
    </Switch>
  </PublicLayout>);

export default PublicRoutes;
