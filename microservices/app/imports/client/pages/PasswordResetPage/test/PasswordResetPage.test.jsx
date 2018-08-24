// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { testCreateUser } from 'core/api';
import { shallow } from 'core/utils/testHelpers/enzyme';
import HOCPasswordResetPage, { PasswordResetPage } from '../PasswordResetPage';
import getMountedComponent from '../../../../core/utils/testHelpers/getMountedComponent';
import pollUntilReady from '../../../../core/utils/testHelpers/pollUntilReady';
import Loading from '../../../../core/components/Loading/Loading';

describe('PasswordResetPage', () => {
  let props;
  const component = () =>
    getMountedComponent({
      Component: HOCPasswordResetPage,
      props,
      withRouter: true,
    });
  const shallowComponent = () => shallow(<PasswordResetPage {...props} />);

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
        }, 200))
      .then(() =>
        expect(component()
          .find('[id="PasswordResetPage.title"]')
          .first()
          .prop('values').name).to.equal('John Doe'));
  });

  it('renders an error', () => {
    const message = 'Test error';
    props.error = { message };

    expect(shallowComponent().contains(message)).to.equal(true);
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
