// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { testCreateUser } from 'core/api';
import PasswordResetPage from '../PasswordResetPage';
import getMountedComponent from '../../../../core/utils/testHelpers/getMountedComponent';
import pollUntilReady from '../../../../core/utils/testHelpers/pollUntilReady';
import Loading from '../../../../core/components/Loading/Loading';

describe('PasswordResetPage', () => {
  let props;
  const component = () =>
    getMountedComponent({
      Component: PasswordResetPage,
      props,
      withRouter: true,
    });

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
        }))
      .then(() => expect(component()
        .find('[id="PasswordResetPage.title"]')
        .first()
        .prop('values').name).to.equal('John Doe'));
  });
});
