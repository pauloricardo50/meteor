import { Meteor } from 'meteor/meteor';

import { Component } from 'react';

import { TRACKING_COOKIE } from 'core/api/analytics/analyticsConstants';
import { analyticsPage } from 'core/api/methods';

import { getCookie, setCookie, parseCookies } from 'core/utils/cookiesHelpers';
import { getMatchingPath } from 'core/api/analytics/helpers';
import { impersonate } from '../Impersonate/ImpersonatePage/ImpersonatePage';

export default class HistoryWatcher extends Component {
  componentDidMount() {
    const { history } = this.props;
    this.generateTrackingId();
    this.loadPage(history.location);
    this.unlisten = history.listen(location => this.loadPage(location));

    if (Meteor.isDevelopment && !(Meteor.isTest || Meteor.isAppTest)) {
      const adminId = sessionStorage.getItem('dev_impersonate_adminId');
      const userId = sessionStorage.getItem('dev_impersonate_userId');
      const authToken = sessionStorage.getItem('dev_impersonate_authToken');
      if (userId && authToken) {
        impersonate({ userId, authToken, adminId });
      }
    }
  }

  componentWillUnmount() {
    // Sometimes the component unmounts before listening is done
    if (this.unlisten) {
      this.unlisten();
    }
  }

  generateTrackingId() {
    const trackingId = getCookie(TRACKING_COOKIE);
    if (!trackingId) {
      const randomId =
        Math.random()
          .toString(36)
          .substr(2) +
        Math.random()
          .toString(36)
          .substr(2);
      setCookie(TRACKING_COOKIE, randomId);
    }
  }

  getMatchingPath = pathname =>
    getMatchingPath({
      pathname,
      routes: this.props.routes,
      history: this.props.history,
    });

  loadPage(location) {
    const { pathname } = location;
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

    if (window.ga) {
      window.ga('set', 'page', location.pathname + location.search);
      window.ga('send', 'pageview');
    }
  }

  render() {
    return this.props.children;
  }
}
