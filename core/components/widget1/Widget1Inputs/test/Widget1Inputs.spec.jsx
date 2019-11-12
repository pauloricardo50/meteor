/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import { Widget1Inputs } from '../Widget1Inputs';
import Widget1SingleInput from '../../Widget1SingleInput';

describe('Widget1Input', () => {
  let props;
  const component = () => shallow(<Widget1Inputs {...props} />);

  beforeEach(() => {
    props = { fields: ['field1', 'field2'] };
  });

  it('renders a root div with the right class', () => {
    expect(
      component()
        .find('div')
        .first()
        .hasClass('widget1-inputs'),
    ).to.equal(true);
  });

  it('renders multiple fields', () => {
    expect(component().find(Widget1SingleInput).length).to.equal(
      props.fields.length,
    );
  });

  it('passes the proper field name to each field', () => {
    component()
      .find(Widget1SingleInput)
      .forEach((node, index) => {
        expect(node.prop('name')).to.equal(props.fields[index]);
      });
  });
});
