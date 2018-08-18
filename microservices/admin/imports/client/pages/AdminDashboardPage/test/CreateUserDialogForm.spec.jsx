/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import DialogForm from 'core/components/Form/DialogForm';
import CreateUserDialogForm, {
  createUserFormFields,
  getFormArray,
} from '../CreateUserDialogForm';

describe('<CreateUserDialogForm />', () => {
  let props;

  const component = () => shallow(<CreateUserDialogForm {...props} />);
  const formArray = getFormArray(createUserFormFields);

  beforeEach(() => {
    props = {
      currentUser: { name: '' },
    };
  });

  it('passes the correct formArray to the DialogForm component', () =>
    expect(component()
      .find(DialogForm)
      .first()
      .prop('formArray')).to.deep.equal(formArray));

  it('adds a validator for the email field', () => {
    const componentFormArray = component()
      .find(DialogForm)
      .first()
      .prop('formArray');

    expect(componentFormArray.find(field => field.id === 'email')).to.have.property('validate');
  });
});
