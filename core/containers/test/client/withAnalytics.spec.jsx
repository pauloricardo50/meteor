/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallow } from '../../../utils/testHelpers/enzyme';
import { getMountedComponent } from '../../../utils/testHelpers';

import withAnalytics from '../../withAnalytics';
import analytics from '../../../api/analytics/client/analytics';

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
      const trackerHoc = withAnalytics({
        func: 'onChange',
        track: submittedText => ({
          eventName: 'Submitted Text',
          metadata: { text: submittedText },
        }),
      });

      const originalOnChange = sinon.spy();
      const component = trackedComponent(trackerHoc, {
        onChange: originalOnChange,
      });

      component.prop('onChange')('my name is John');

      expect(analytics.track.lastCall.args).to.deep.equal([
        'Submitted Text',
        { text: 'my name is John' },
      ]);

      expect(originalOnChange.lastCall.args).to.deep.equal(['my name is John']);
    });

    it('calls the original function with all arguments the event name only');

    it('returns the return value of the original function');

    it('tracks the event name only');
  });

  describe('Lifecycle Tracker', () => {
    beforeEach(() => {
      getMountedComponent.reset();
    });

    it('tracks a lifecycle method by event name and metadata', () => {
      const trackerHoc = withAnalytics({
        lifecycleMethod: 'componentDidMount',
        track: () => ({
          eventName: 'Opened User Preferences',
          metadata: { some: 'meta' },
        }),
      });

      const component = mountedComponent(trackerHoc, {
        user: { email: 'user@test.com' },
      });
      component.unmount();

      expect(analytics.track.lastCall.args).to.deep.equal([
        'Opened User Preferences',
        { some: 'meta' },
      ]);
    });

    it('does not crash the original component');
  });
});
