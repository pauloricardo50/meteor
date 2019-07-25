import { Meteor } from 'meteor/meteor';

import { Component } from 'react';
import { matchPath } from 'react-router-dom';

import { TRACKING_COOKIE } from 'core/api/analytics/analyticsConstants';
import { analyticsPage } from 'core/api/methods';

import { getCookie, setCookie, parseCookies } from 'core/utils/cookiesHelpers';
import { impersonate } from '../Impersonate/ImpersonatePage/ImpersonatePage';

export default class HistoryWatcher extends Component {
  componentDidMount() {
    const { history } = this.props;
    this.generateTrackingId();
    this.loadPage(history.location.pathname);
    this.unlisten = history.listen(({ pathname }) => this.loadPage(pathname));

    if (Meteor.isDevelopment && !(Meteor.isTest || Meteor.isAppTest)) {
      const userId = sessionStorage.getItem('dev_impersonate_userId');
      const authToken = sessionStorage.getItem('dev_impersonate_authToken');
      if (userId && authToken) {
        impersonate({ userId, authToken });
      }
    }
  }

  componentWillUnmount() {
    // Sometimes the component unmounts before listening is done
    if (this.unlisten) {
      this.unlisten();
    }
  }

  getMatchingPath(pathname) {
    const { routes = {}, history } = this.props;
    let matchingPath = null;

    const searchParams = history.location.search;
    const queryString = {};

    Object.keys(routes).forEach((route) => {
      if (matchingPath === null && route !== 'NOT_FOUND') {
        const match = matchPath(pathname, routes[route]);

        if (searchParams) {
          const params = new URLSearchParams(searchParams);
          [...params.entries()].forEach(([key, value]) => {
            queryString[key] = value;
          });
        }

        matchingPath = match && {
          path: pathname,
          route,
          params: match.params,
          queryString,
        };
      }
    });

    return (
      matchingPath || {
        path: pathname,
        route: 'NOT_FOUND',
        params: {},
        queryString,
      }
    );
  }

  generateTrackingId() {
    const trackingId = getCookie(TRACKING_COOKIE);
    if (!trackingId) {
      const randomId = Math.random()
        .toString(36)
        .substr(2)
        + Math.random()
          .toString(36)
          .substr(2);
      setCookie(TRACKING_COOKIE, randomId);
    }
  }

  loadPage(pathname) {
    const {
      path,
      route,
      params,
      searchParams,
      queryString,
    } = this.getMatchingPath(pathname);
    const cookies = parseCookies();
    const { sessionStorage } = window;
    analyticsPage.run({
      cookies,
      sessionStorage,
      path,
      route,
      queryParams: params,
      queryString,
    });
  }

  render() {
    return this.props.children;
  }
}
