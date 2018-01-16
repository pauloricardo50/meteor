import React from 'react';
// import { Route, Switch } from 'react-router-dom';

import BaseRouter, { Route, Switch } from 'core/components/BaseRouter';
import NotFound from 'core/components/NotFound';
import { getUserLocale, getFormats } from 'core/utils/localization';
import messagesFR from '../../../lang/fr.json';

import LoginPage from 'core/components/LoginPage';
import PublicLayout from '../../ui/layouts/PublicLayout';
import HomePage from '../../ui/pages/HomePage';
import AboutPage from '../../ui/pages/AboutPage';
import CareersPage from '../../ui/pages/CareersPage';
import TosPage from '../../ui/pages/TosPage';
import FaqPage from '../../ui/pages/FaqPage';
import EmailVerificationPage from '../../ui/pages/EmailVerificationPage';
import PasswordResetPage from '../../ui/pages/PasswordResetPage';
import Start1Page from '../../ui/pages/Start1Page';
import Start2Page from '../../ui/pages/Start2Page';
import PasswordPage from '../../ui/pages/PasswordPage';
import CheckMailboxPage from '../../ui/pages/CheckMailboxPage';

const WwwRouter = () => (
  <BaseRouter
    locale={getUserLocale()}
    messages={messagesFR}
    formats={getFormats()}
    hasLogin={false} // should be false
  >
    <PublicLayout>
      <Switch>
        <Route path="/" exact component={PasswordPage} />
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
        <Route path="/checkYourMailbox/:email" component={CheckMailboxPage} />
        <Route component={NotFound} to="/home" />
      </Switch>
    </PublicLayout>
  </BaseRouter>
);

export default WwwRouter;
