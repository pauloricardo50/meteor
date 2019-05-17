import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import queryString from 'query-string';
import { matchPath } from 'react-router-dom';

import { TRACKING_COOKIE } from 'core/api/analytics/constants';

import { getCookie, setCookie } from 'core/utils/cookiesHelpers';

export default class HistoryWatcher extends Component {
  componentDidMount() {
    const { history } = this.props;
    this.generateTrackingId();
    this.loadPage(history.location.pathname);
    this.unlisten = history.listen(({ pathname }) => this.loadPage(pathname));
  }

  componentWillUnmount() {
    this.unlisten();
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
    const query = {
      path,
      route,
      meteorUserId: Meteor.userId(),
      ...params,
    };
    const { subdomain } = this.props;
    const trackingUrl = `${
      Meteor.settings.public.subdomains[subdomain]
    }/pagetrack`;
    fetch(
      `${trackingUrl}?${queryString.stringify(query, {
        encode: true,
      })}`,
      {
        headers: {
          cookie: document.cookie,
        },
        method: 'GET',
      },
    );
  }

  render() {
    return this.props.children;
  }
}
