// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import T from 'core/components/Translation';

import MicrolocationFactor from '../MicrolocationFactor';
import MicrolocationFactorGrade from '../MicrolocationFactorGrade';

describe('MicrolocationFactor', () => {
  let props;
  const component = () => shallow(<MicrolocationFactor {...props} />);

  beforeEach(() => {
    props = { label: 'Test label', factors: { grade: 5 } };
  });

  it('renders', () => {
    expect(component()
      .find(T)
      .exists()).to.equal(true);
    expect(component()
      .find(MicrolocationFactorGrade)
      .exists()).to.equal(true);

    expect(component()
      .find('[className="microlocation-factor"]')
      .exists()).to.equal(true);
  });

  it('displays as many factors as there are in factors', () => {
    props.factors = {
      factor1: { grade: 4, text: 'text1' },
      factor2: { grade: 4, text: 'text2' },
      factor3: { grade: 4, text: 'text3' },
    };

    expect(component().find(MicrolocationFactorGrade)).to.have.length(4);
  });
});
