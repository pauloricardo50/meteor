import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PublicLayout, Start2Page } from '/imports/ui/containers/PublicContainers';
import HomePage from '/imports/ui/pages/public/HomePage.jsx';
import Start1Page from '/imports/ui/pages/public/Start1Page.jsx';
import LoginPage from '/imports/ui/pages/public/LoginPage.jsx';
import AboutPage from '/imports/ui/pages/public/AboutPage.jsx';
import CareersPage from '/imports/ui/pages/public/CareersPage.jsx';
import TosPage from '/imports/ui/pages/public/TosPage.jsx';
import EmailVerificationPage from '/imports/ui/pages/public/EmailVerificationPage.jsx';
import TestPage from '/imports/ui/pages/public/TestPage.jsx';

const PublicRoutes = props => (
  <PublicLayout {...props}>
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
    </Switch>
  </PublicLayout>
);

export default PublicRoutes;
