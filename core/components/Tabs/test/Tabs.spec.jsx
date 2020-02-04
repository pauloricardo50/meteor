//      
/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import getMountedComponent from 'core/utils/testHelpers/getMountedComponent';

import Tabs from '../Tabs';

describe('Tabs', () => {
  let props;
  const component = () =>
    getMountedComponent({
      Component: Tabs,
      props,
    });

  beforeEach(() => {
    props = {
      tabs: [
        { label: 'test1', content: 'hello world' },
        { label: 'test2', content: 'hello world' },
      ],
    };
  });

  it.skip('calls onChange prop when changing tabs', () => {
    const onChangeSpy = sinon.spy();
    props.onChange = sinon.spy();

    component()
      .find('.core-tabs-tab')
      .last()
      .simulate('click');
    component().update();

    expect(onChangeSpy.calledOnce).to.equal(true);
  });
});
