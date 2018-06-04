/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import CreateUserDialogForm, { formFields } from '../CreateUserDialogForm';

describe('<CreateUserDialogForm />', () => {
  it('returns a form ', () => {
    const wrapper = shallow(<CreateUserDialogForm />);
    expect(wrapper.find('form')).to.have.length(1);
  });

  it('contains corresponding inputs for all fields defined in formFields', () => {
    const wrapper = shallow(<CreateUserDialogForm />);
    formFields.forEach(field =>
      expect(wrapper.find(`input#${field}`)).to.have.length(1));
  });
});
