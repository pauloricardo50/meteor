import React from 'react';
import { Route, Switch } from 'react-router-dom';

import BaseRouter from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';

import {
  PublicLayout,
  Start2Page,
} from '/imports/ui/containers/PublicContainers';
import HomePage from '/imports/ui/pages/public/HomePage';
import LoginPage from '/imports/ui/pages/public/LoginPage';
import AboutPage from '/imports/ui/pages/public/AboutPage';
import CareersPage from '/imports/ui/pages/public/CareersPage';
import TosPage from '/imports/ui/pages/public/TosPage';
import FaqPage from '/imports/ui/pages/public/FaqPage';
import EmailVerificationPage from '/imports/ui/pages/public/EmailVerificationPage';
import PasswordResetPage from '/imports/ui/pages/public/PasswordResetPage';
import Start1Page from '/imports/ui/pages/public/Start1Page';

const AdminRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={getTranslations()}
    formats={getFormats()}
  >
    <PublicLayout>
      <Switch>
        <Route path="/home" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/start1/:type" component={Start1Page} />
        <Route path="/start2/:type" component={Start2Page} />
        <Route path="/careers" component={CareersPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/tos" component={TosPage} />
        <Route path="/faq" component={FaqPage} />
        <Route path="/verify-email/:token" component={EmailVerificationPage} />
        <Route path="/reset-password/:token" component={PasswordResetPage} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  </BaseRouter>
);

export default AdminRouter;
