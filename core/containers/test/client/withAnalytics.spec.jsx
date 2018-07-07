/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallow } from '../../../utils/testHelpers/enzyme';

import withAnalytics from '../../withAnalytics';

const component = (props, withAnalyticsContainer) => {
  const WrappedComponent = () => null;
  const Component = withAnalyticsContainer(WrappedComponent);

  return shallow(<Component {...props} />);
};

describe('withAnalytics', () => {
  beforeEach(() => {
    // I think it would be much better to use a Analytics class / function class of which methods we can stub
    Meteor.isTest = false;
  });

  afterEach(() => {
    Meteor.isTest = true;
  });

  it('tracks a function prop', () => {
    const track = sinon.spy();
    const hoc = withAnalytics({ func: 'onClick', track });

    const wrapper = component({ onClick: () => {} }, hoc);
    wrapper.prop('onClick')();

    expect(track.called).to.equal(true);
  });

  it('intercepts the params of the tracked function');

  it('tracks the event name');

  it('tracks the event metadata');

  it('tracks a lifecycle method', () => {
    const track = sinon.spy();
    const hoc = withAnalytics({ lifecycleMethod: 'componentDidMount', track });

    component({}, hoc);

    expect(track.called).to.equal(true);
  });
});
