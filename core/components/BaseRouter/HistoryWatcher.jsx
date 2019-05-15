import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import queryString from 'query-string';
import { TRACKING_COOKIE } from 'core/api/analytics/constants';

export default class HistoryWatcher extends Component {
  componentDidMount() {
    const { history } = this.props;
    this.generateAnonymousId();
    this.loadPage(history.location.pathname);
    history.listen(({ pathname }) => this.loadPage(pathname));
  }

  getCookie(cookieName) {
    const cookie = RegExp(`${cookieName}[^;]+`).exec(document.cookie);
    return decodeURIComponent(cookie ? cookie.toString().replace(/^[^=]+./, '') : '');
  }

  setCookie(cookieName, value) {
    document.cookie = `${cookieName}=${value}`;
  }

  generateAnonymousId() {
    const anonymousId = this.getCookie(TRACKING_COOKIE);
    if (!anonymousId) {
      const randomId = Random.id();
      this.setCookie(TRACKING_COOKIE, randomId);
    }
  }

  loadPage(pathname) {
    const query = { path: pathname, userId: Meteor.userId() };
    fetch(
      `http://localhost:4000/pagetrack?${queryString.stringify(query, {
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
