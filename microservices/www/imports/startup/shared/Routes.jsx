import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from 'core/components/NotFound/loadable';
import ScrollToTop from 'core/components/ScrollToTop';

import AboutPage from '../../ui/pages/AboutPage/loadable';
import BlogPage from '../../ui/pages/BlogPage/loadable';
import BlogPostPage from '../../ui/pages/BlogPostPage/loadable';
import CareersPage from '../../ui/pages/CareersPage/loadable';
import ContactPage from '../../ui/pages/ContactPage/loadable';
import FaqPage from '../../ui/pages/FaqPage/loadable';
import HomePage from '../../ui/pages/HomePage'; // Load this page instantly
import InterestsPage from '../../ui/pages/InterestsPage/loadable';
import TypoPage from '../../ui/pages/TypoPage';
import Widget1Page from '../../ui/pages/Widget1Page/loadable';
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
  TYPO_PAGE: { path: '/typo', component: TypoPage },

  NOT_FOUND: { component: NotFound },
};

const Routes = () => (
  <GoogleAnalyticsTracker>
    <ScrollToTop>
      <Switch>
        {Object.keys(WWW_ROUTES).map(route => (
          <Route key={route} {...WWW_ROUTES[route]} />
        ))}
      </Switch>
    </ScrollToTop>
  </GoogleAnalyticsTracker>
);

export default Routes;
