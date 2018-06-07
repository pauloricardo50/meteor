/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import DialogForm from 'core/components/Form/DialogForm';
import CreateUserDialogForm, {
  createUserFormFields,
  getFormArray,
} from '../CreateUserDialogForm';

const component = props => shallow(<CreateUserDialogForm {...props} />);

describe('<CreateUserDialogForm />', () => {
  const formArray = getFormArray(createUserFormFields);

  it('passes the correct formArray to the DialogForm component', () =>
    expect(
      component()
        .find(DialogForm)
        .first()
        .prop('formArray'),
    ).to.deep.equal(formArray));
});
