/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import getMountedComponent from '../../../../utils/testHelpers/getMountedComponent';
import AutoFormLayout from '../../AutoFormLayout';

const AutoField = props => <span {...props} />;
const DemoComponent = props => <span {...props} />;

describe('AutoFormLayout', () => {
  let props;
  const component = () =>
    getMountedComponent({ Component: AutoFormLayout, props });

  beforeEach(() => {
    getMountedComponent.reset();
    props = { AutoField, schemaKeys: ['field1', 'field2', 'field3'] };
  });

  it('renders fields in a different layout', () => {
    props.layout = [
      { className: 'div1', fields: ['field1'] },
      { className: 'div2', fields: ['field2'] },
    ];

    expect(component().find('.div1').length).to.equal(1);
    expect(component().find('.div2').length).to.equal(1);
    expect(component().find('.div1 span[name="field1"]').length).to.equal(1);
    expect(component().find('.div2 span[name="field2"]').length).to.equal(1);
  });

  it('renders custom components', () => {
    props.layout = {
      className: 'div1',
      fields: ['field1'],
      Component: DemoComponent,
    };

    expect(component().find(DemoComponent).length).to.equal(1);
    expect(
      component()
        .find(DemoComponent)
        .prop('className'),
    ).to.equal('div1');
    expect(
      component()
        .find(DemoComponent)
        .find('span[name="field1"]').length,
    ).to.equal(1);
  });

  it('renders all fields when a star is used in the field name', () => {
    props.layout = [{ className: 'div1', fields: ['field*'] }];
    props.schemaKeys = ['field1', 'field2', 'field3'];

    expect(component().find('.div1').length).to.equal(1);
    expect(component().find('.div1 span[name="field1"]').length).to.equal(1);
    expect(component().find('.div1 span[name="field2"]').length).to.equal(1);
    expect(component().find('.div1 span[name="field3"]').length).to.equal(1);
  });
});
