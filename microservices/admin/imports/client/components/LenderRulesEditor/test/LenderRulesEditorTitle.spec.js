// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import LenderRulesEditorTitle from '../LenderRulesEditorTitle';

describe('LenderRulesEditorTitle', () => {
  let props;
  const component = () => shallow(<LenderRulesEditorTitle {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('Renders the name of the rule', () => {
    props.filter = {
      and: [{ '==': [{ var: 'stuff' }, 'OPTION1'] }],
    };
    expect(component()
      .children()
      .at(0)
      .prop('id')).to.equal('Forms.stuff');
    expect(component()
      .children()
      .at(2)
      .prop('id')).to.equal('Forms.stuff.OPTION1');
  });

  it('renders multiple rules', () => {
    props.filter = {
      and: [
        { '==': [{ var: 'stuff' }, 'OPTION1'] },
        { '==': [{ var: 'other' }, 'OPTION2'] },
      ],
    };
    expect(component()
      .children()
      .at(0)
      .prop('id')).to.equal('Forms.stuff');

    expect(component()
      .children()
      .at(2)
      .prop('id')).to.equal('Forms.stuff.OPTION1');

    expect(component()
      .children()
      .at(4)
      .prop('id')).to.equal('general.and');

    expect(component()
      .children()
      .at(6)
      .prop('id')).to.equal('Forms.other');

    expect(component()
      .children()
      .at(8)
      .prop('id')).to.equal('Forms.other.OPTION2');
  });
});
