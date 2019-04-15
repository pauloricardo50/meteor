// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { testCreateUser } from '../../../../api';
import {
  shallow,
  getMountedComponent,
  pollUntilReady,
} from '../../../../utils/testHelpers';
import Loading from '../../../Loading/Loading';
import PasswordResetPage, {
  PasswordResetPage as PasswordResetPageDumb,
} from '../../PasswordResetPage';

describe('PasswordResetPage', () => {
  let props;
  const component = () =>
    getMountedComponent({
      Component: PasswordResetPage,
      props,
      withRouter: true,
    });
  const shallowComponent = () => shallow(<PasswordResetPageDumb {...props} />);

  beforeEach(() => {
    resetDatabase();
    getMountedComponent.reset();
    props = { token: 'token12345', email: 'john.doe@test.com' };
  });

  it('renders the name', () => {
    const { email, token } = props;
    const firstName = 'John';
    const lastName = 'Doe';
    return testCreateUser
      .run({
        user: {
          email,
          firstName,
          lastName,
          services: { password: { reset: { token } } },
          roles: ['user'],
        },
      })
      .then(() =>
        pollUntilReady(() => {
          component().update();
          return !component().find(Loading).length;
        }, 10))
      .then(() => expect(component().contains('John Doe')).to.equal(true));
  });

  it('renders an error', () => {
    props.error = { message: 'Test error' };
    
    expect(shallowComponent().find('.error').length).to.equal(1);
  });

  context('disables submit button when', () => {
    it('new password is not set', () => {
      props.user = { id: 'userId' };

      expect(shallowComponent()
        .find('[type="submit"]')
        .first()
        .props().disabled).to.equal(true);
    });

    it('passwords do not match', () => {
      props.newPassword = 'password1';
      props.newPassword2 = 'password2';
      props.user = { id: 'userId' };

      expect(shallowComponent()
        .find('[type="submit"]')
        .first()
        .props().disabled).to.equal(true);
    });
  });

  it('loads while submitting', () => {
    const password = 'password';
    props.submitting = true;
    props.newPassword = password;
    props.newPassword2 = password;
    props.user = { id: 'userId' };

    expect(shallowComponent()
      .find('[type="submit"]')
      .first()
      .props().loading).to.equal(true);
  });
});
