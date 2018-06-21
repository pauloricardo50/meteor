/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import DialogForm from 'core/components/Form/DialogForm';
import EditUserDialogForm, {
  editUserFormFields,
  getEditUserFormArray,
} from '../EditUserDialogForm';

const params = {
  user: {
    _id: '_id',
    firstName: 'testFirstname',
    lastName: 'lastname',
    phone: '0123456',
  },
};
const component = props => shallow(<EditUserDialogForm {...props} />);

describe('<EditUserDialogForm />', () => {
  const formArray = getEditUserFormArray(editUserFormFields);

  it('passes the correct formArray to the DialogForm component', () =>
    expect(component(params)
      .find(DialogForm)
      .first()
      .prop('formArray')).to.deep.equal(formArray));
});
