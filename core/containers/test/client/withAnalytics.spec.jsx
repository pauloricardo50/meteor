/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallow } from '../../../utils/testHelpers/enzyme';
import { getMountedComponent } from '../../../utils/testHelpers';

import withAnalytics from '../../withAnalytics';
import analytics from '../../../api/analytics/client/analytics';
import EVENTS, { addEvent } from '../../../api/analytics/events';

addEvent('SUBMITTED_USER_FORM', {
  func: 'onChange',
  config: submittedText => ({
    eventName: 'Submitted Text',
    metadata: { text: submittedText },
  }),
});

addEvent('OPENED_USER_PREFS', {
  lifecycleMethod: 'componentDidMount',
  config: ({ user: { email } }) => ({
    eventName: 'Opened User Preferences',
    metadata: { email },
  }),
});

const trackedComponent = (trackerHoc, props) => {
  const WrappedComponent = () => null;
  const Component = trackerHoc(WrappedComponent);

  return shallow(<Component {...props} />);
};

const mountedComponent = (trackerHoc, props) => {
  const WrappedComponent = () => null;
  const Component = trackerHoc(WrappedComponent);

  return getMountedComponent({
    Component,
    props,
    withRouter: false,
  });
};

describe.only('withAnalytics', () => {
  beforeEach(() => {
    sinon.stub(analytics, 'track');
  });

  afterEach(() => {
    analytics.track.restore();
  });

  describe('Callback Tracker', () => {
    it('calls `analytics.track` with the event name and metadata', () => {
      const trackerHoc = withAnalytics(EVENTS.SUBMITTED_USER_FORM);

      const originalOnChange = sinon.spy();
      const component = trackedComponent(trackerHoc, {
        onChange: originalOnChange,
      });

      component.prop('onChange')('my name is John');

      expect(analytics.track.lastCall.args).to.deep.equal([
        EVENTS.SUBMITTED_USER_FORM,
        'my name is John',
      ]);

      expect(originalOnChange.lastCall.args).to.deep.equal(['my name is John']);
    });

    it('calls the original function with all original arguments');

    it('returns the return value of the original function');

    it('tracks the event name only');
  });

  describe('Lifecycle Tracker', () => {
    beforeEach(() => {
      getMountedComponent.reset();
    });

    it('tracks a lifecycle method by event name and metadata', () => {
      const trackerHoc = withAnalytics(EVENTS.OPENED_USER_PREFS);

      const user = { email: 'user@test.com' };
      mountedComponent(trackerHoc, {
        user,
      });

      expect(analytics.track.lastCall.args).to.deep.equal([
        EVENTS.OPENED_USER_PREFS,
        { user },
      ]);
    });

    it('does not crash the original component');
  });
});
