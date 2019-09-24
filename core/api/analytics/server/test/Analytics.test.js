/* eslint-env mocha */
import { Random } from 'meteor/random';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import sinon from 'sinon';

import SessionService from 'core/api/sessions/server/SessionService';
import Analytics from '../Analytics';
import EVENTS from '../../events';
import TestAnalytics from '../TestAnalytics';

describe.only('Analytics', () => {
  beforeEach(() => {
    resetDatabase();
  });

  afterEach(() => {
    TestAnalytics.prototype.track.restore();
  });

  it('should track events', async () => {
    const spy = sinon.spy(TestAnalytics.prototype, 'track');
    const connectionId = Random.id();

    await SessionService.insert({
      connectionId,
      ip: '127.0.0.1',
    });

    const analytics = new Analytics({ connection: { id: connectionId } });

    analytics.track(EVENTS.USER_LOGGED_IN);

    expect(spy.callCount).to.equal(1);
  });

  it('should not track events when impersonating users', async () => {
    const spy = sinon.spy(TestAnalytics.prototype, 'track');
    const connectionId = Random.id();

    await SessionService.insert({
      connectionId,
      isImpersonate: true,
      ip: '127.0.0.1',
    });

    const analytics = new Analytics({ connection: { id: connectionId } });

    analytics.track(EVENTS.USER_LOGGED_IN);

    expect(spy.callCount).to.equal(0);
  });
});
