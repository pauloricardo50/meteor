/* eslint-env mocha */
import { expect } from 'chai';
import { TRACKING_COOKIE } from 'core/api/analytics/constants';

import HistoryWatcher from '../HistoryWatcher';

const routes = {
  bar: { path: '/foo/:id' },
  foo: { path: '/foo' },
};

const deleteAllCookies = () => {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

describe.only('HistoryWatcher', () => {
  const watcher = new HistoryWatcher({ routes });

  context('getMatchingPath', () => {
    it('returns the matching path', () => {
      const path = watcher.getMatchingPath('/foo');
      expect(path).to.deep.equal({ path: '/foo', route: 'foo', params: {} });
    });

    it('returns the matching path with params', () => {
      const path = watcher.getMatchingPath('/foo/abc');
      expect(path).to.deep.equal({
        path: '/foo/abc',
        route: 'bar',
        params: { id: 'abc' },
      });
    });

    it('returns the NOT_FOUND if no matching path is found', () => {
      const path = watcher.getMatchingPath('/test');
      expect(path).to.deep.equal({
        path: '/test',
        route: 'NOT_FOUND',
        params: {},
      });
    });
  });

  context('generateTrackingId', () => {
    beforeEach(() => {
      deleteAllCookies();
    });

    it('generates a new tracking id', () => {
      expect(watcher.getCookie(TRACKING_COOKIE)).to.equal('');
      watcher.generateTrackingId();
      expect(watcher.getCookie(TRACKING_COOKIE)).to.not.equal('');
    });

    it('does not generate a new tracking id if one already exists', () => {
      watcher.generateTrackingId();
      const trackingId = watcher.getCookie(TRACKING_COOKIE);
      watcher.generateTrackingId();
      expect(watcher.getCookie(TRACKING_COOKIE)).to.equal(trackingId);
    });
  });
});
