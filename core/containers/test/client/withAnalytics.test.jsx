/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallow } from '../../../utils/testHelpers/enzyme';
import { getMountedComponent } from '../../../utils/testHelpers';

import withAnalytics from '../../withAnalytics';
import analytics from '../../../api/analytics/client/analytics';
import { addEvent } from '../../../api/analytics/eventsHelpers';

const trackedComponent = (trackerHoc, props) => {
  const WrappedWithTrackedFunction = () => null;
  const Component = trackerHoc(WrappedWithTrackedFunction);

  return shallow(<Component {...props} />);
};

let WrappedWithLifecyle = () => null;
const mountedComponent = (trackerHoc, props) => {
  WrappedWithLifecyle = () => null;
  const Component = trackerHoc(WrappedWithLifecyle);

  return getMountedComponent({
    Component,
    props,
    withRouter: false,
  });
};

describe('withAnalytics', () => {
  before(() => {
    addEvent('SUBMITTED_USER_SURVEY', {
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

    addEvent('CLICKED_LOGO', {
      func: 'onClick',
      config: {
        eventName: 'Clicked Logo',
      },
    });

    addEvent('SOME_LIFECYCLE_EVENT', {
      lifecycleMethod: 'componentDidMount',
      config: {
        eventName: 'Some Lyfecicle Event',
      },
    });
  });

  beforeEach(() => {
    sinon.stub(analytics, 'track');
  });

  afterEach(() => {
    analytics.track.restore();
  });

  describe('Callback Tracker', () => {
    let component;
    let originalOnChange;
    let returnValueOfTrackedFunction;

    beforeEach(() => {
      const trackerHoc = withAnalytics('SUBMITTED_USER_SURVEY');

      originalOnChange = sinon.stub().callsFake(() => 'the return value');
      component = trackedComponent(trackerHoc, {
        onChange: originalOnChange,
      });

      returnValueOfTrackedFunction = component.prop('onChange')('my name is John');
    });

    it('calls `analytics.track` with the event name only', () => {
      const trackerHoc = withAnalytics('CLICKED_LOGO');

      component = trackedComponent(trackerHoc, {
        onClick: () => {},
      });
      component.prop('onClick')();

      expect(analytics.track.lastCall.args).to.deep.equal([
        'CLICKED_LOGO',
      ]);
    });

    it('calls `analytics.track` with the event name and metadata', () => {
      expect(analytics.track.lastCall.args).to.deep.equal([
        'SUBMITTED_USER_SURVEY',
        'my name is John',
      ]);
    });

    it('calls the original function with all original arguments', () => {
      expect(originalOnChange.lastCall.args).to.deep.equal(['my name is John']);
    });

    it('returns the return value of the original function', () => {
      const originallyReturnedValue = originalOnChange.returnValues[originalOnChange.returnValues.length - 1];

      expect(originallyReturnedValue).to.equal('the return value');

      expect(returnValueOfTrackedFunction).to.equal(originallyReturnedValue);
    });
  });

  describe('Lifecycle Tracker', () => {
    let component;
    let user;

    beforeEach(() => {
      getMountedComponent.reset();

      const trackerHoc = withAnalytics('OPENED_USER_PREFS');

      user = { email: 'user@test.com' };

      component = mountedComponent(trackerHoc, {
        user,
      });
    });

    it('tracks a lifecycle method by event name and props', () => {
      expect(analytics.track.lastCall.args).to.deep.equal([
        'OPENED_USER_PREFS',
        { user },
      ]);
    });

    it('does not crash the original component', () => {
      expect(component.find(WrappedWithLifecyle).length).to.equal(1);
    });
  });
});
