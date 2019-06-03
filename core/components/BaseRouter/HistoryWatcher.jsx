import { Component } from 'react';
import { matchPath } from 'react-router-dom';

import { TRACKING_COOKIE } from 'core/api/analytics/analyticsConstants';
import { analyticsPage } from 'core/api/methods';

import { getCookie, setCookie, parseCookies } from 'core/utils/cookiesHelpers';

export default class HistoryWatcher extends Component {
  componentDidMount() {
    const { history } = this.props;
    this.generateTrackingId();
    this.loadPage(history.location.pathname);
    this.unlisten = history.listen(({ pathname }) => this.loadPage(pathname));
  }

  componentWillUnmount() {
    // Sometimes the component unmounts before listening is done
    if (this.unlisten) {
      this.unlisten();
    }
  }

  getMatchingPath(pathname) {
    const { routes = {} } = this.props;
    let matchingPath = null;

    Object.keys(routes).forEach((route) => {
      if (matchingPath === null && route !== 'NOT_FOUND') {
        const match = matchPath(pathname, routes[route]);
        matchingPath = match && { path: pathname, route, params: match.params };
      }
    });

    return matchingPath || { path: pathname, route: 'NOT_FOUND', params: {} };
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
    const { path, route, params } = this.getMatchingPath(pathname);
    const cookies = parseCookies();
    const { sessionStorage } = window;
    analyticsPage.run({
      cookies,
      sessionStorage,
      path,
      route,
      queryParams: params,
    });
  }

  render() {
    return this.props.children;
  }
}
