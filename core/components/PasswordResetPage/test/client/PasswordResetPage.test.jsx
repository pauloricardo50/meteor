// @flow
/* eslint-env mocha */
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { expect } from 'chai';
import { Redirect } from 'react-router-dom';

import { testCreateUser } from '../../../../api';
import { shallow, getMountedComponent } from '../../../../utils/testHelpers';
import pollUntilReady from '../../../../utils/pollUntilReady';
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

  beforeEach((done) => {
    getMountedComponent.reset();
    props = { token: Random.id(), email: 'john.doe@test.com' };
    Meteor.call('resetDatabase', () => {
      done();
    });
  });

  it('renders the name', async () => {
    const { email, token } = props;
    const firstName = 'John';
    const lastName = 'Doe';

    // FIXME: testCreateUser is called twice
    try {
      await testCreateUser.run({
        user: {
          email,
          firstName,
          lastName,
          services: { password: { reset: { token } } },
          roles: ['user'],
        },
      });
    } catch (error) {
      console.log('error:', error);
    }

    return pollUntilReady(() => {
      component().update();
      return !component().find(Loading).length;
    }, 10).then(() => expect(component().contains('John Doe')).to.equal(true));
  });

  it('Redirects to the login page if there is an error', () => {
    props.error = { message: 'Test error' };

    expect(shallowComponent().find(Redirect).length).to.equal(1);
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
