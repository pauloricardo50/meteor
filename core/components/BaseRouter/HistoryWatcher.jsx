import { Meteor } from 'meteor/meteor';

import { Component } from 'react';

import { TRACKING_COOKIE } from '../../api/analytics/analyticsConstants';
import { getMatchingPath } from '../../api/analytics/helpers';
import { analyticsPage } from '../../api/analytics/methodDefinitions';
import { getCookie, parseCookies, setCookie } from '../../utils/cookiesHelpers';
import { uuidv4 } from '../../utils/general';
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
      const randomId = uuidv4();
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
    const { path, route, params, queryString } = this.getMatchingPath(pathname);
    const cookies = parseCookies();
    const { sessionStorage } = window;
    analyticsPage.run({
      cookies,
      sessionStorage,
      path,
      route,
      queryParams: params,
      queryString,
      microservice: Meteor.microservice,
    });

    if (window.gtag) {
      window.gtag('config', window.GA_TAG, {
        page_path: location.pathname + location.search,
      });
    }
  }

  render() {
    return this.props.children;
  }
}
