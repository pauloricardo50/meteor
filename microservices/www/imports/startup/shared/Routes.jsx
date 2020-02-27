import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ScrollToTop from 'core/components/ScrollToTop';
import NotFound from 'core/components/NotFound/loadable';

import BlogPostPage from '../../ui/pages/BlogPostPage/loadable';
import HomePage from '../../ui/pages/HomePage'; // Load this page instantly
import AboutPage from '../../ui/pages/AboutPage/loadable';
import FaqPage from '../../ui/pages/FaqPage/loadable';
import ContactPage from '../../ui/pages/ContactPage/loadable';
import CareersPage from '../../ui/pages/CareersPage/loadable';
import Widget1Page from '../../ui/pages/Widget1Page/loadable';
import InterestsPage from '../../ui/pages/InterestsPage/loadable';
import BlogPage from '../../ui/pages/BlogPage/loadable';
import GoogleAnalyticsTracker from './GoogleAnalyticsTracker';

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

  NOT_FOUND: { component: NotFound },
};

const Routes = () => (
  <ScrollToTop>
    <Switch>
      <GoogleAnalyticsTracker>
        {Object.keys(WWW_ROUTES).map(route => (
          <Route key={route} {...WWW_ROUTES[route]} />
        ))}
      </GoogleAnalyticsTracker>
    </Switch>
  </ScrollToTop>
);

export default Routes;
