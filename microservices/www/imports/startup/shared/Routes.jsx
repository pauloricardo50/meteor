import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ScrollToTop from 'core/components/ScrollToTop';
import NotFound from 'core/components/NotFound/loadable';
import togglePoint, { TOGGLE_POINTS } from 'core/api/features/togglePoint';

import BlogPostPage from '../../ui/pages/BlogPostPage/loadable';
import HomePage from '../../ui/pages/HomePage'; // Load this page instantly
import AboutPage from '../../ui/pages/AboutPage/loadable';
import FaqPage from '../../ui/pages/FaqPage/loadable';
import ContactPage from '../../ui/pages/ContactPage/loadable';
import CareersPage from '../../ui/pages/CareersPage/loadable';
import ConditionsPage from '../../ui/pages/ConditionsPage/loadable';
import Widget1Page from '../../ui/pages/Widget1Page/loadable';
import CheckMailboxPage from '../../ui/pages/CheckMailboxPage/loadable';
import InterestsPage from '../../ui/pages/InterestsPage/loadable';
import BlogPage from '../../ui/pages/BlogPage/loadable';

const liteVersionModifier = togglePoint(TOGGLE_POINTS.ROUTES_CONFIG_STRIPPED_IN_LITE_VERSION);

export const WWW_ROUTES = {
  HOME_PAGE: { exact: true, path: '/', component: HomePage },
  WIDGET1_PAGE: { path: '/start/1', component: Widget1Page },
  CONTACT_PAGE: { path: '/contact', component: ContactPage },
  INTERESTS_PAGE: { path: '/interests', component: InterestsPage },
  CAREERS_PAGE: { path: '/careers', component: CareersPage },
  ABOUT_PAGE: { path: '/about', component: AboutPage },
  FAQ_PAGE: { path: '/faq', component: FaqPage },
  BLOG_POST_PAGE: { path: '/blog/:slug', component: BlogPostPage },
  BLOG_PAGE: { path: '/blog', component: BlogPage },

  ...liteVersionModifier({
    CONDITIONS_PAGE: { path: '/conditions', component: ConditionsPage },
    CHECK_MAILBOX_PAGE: {
      path: '/checkYourMailbox/:email',
      component: CheckMailboxPage,
    },
  }),

  NOT_FOUND: { component: NotFound },
};

const Routes = () => (
  <ScrollToTop>
    <Switch>
      {Object.keys(WWW_ROUTES).map(route => (
        <Route key={route} {...WWW_ROUTES[route]} />
      ))}
    </Switch>
  </ScrollToTop>
);

export default Routes;
