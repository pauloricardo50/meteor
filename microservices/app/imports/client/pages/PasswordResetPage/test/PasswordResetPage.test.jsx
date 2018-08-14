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

describe.only('PasswordResetPage', () => {
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
        pollUntilReady(
          () => {
            component().update();
            console.log(component().debug());
            return !component().find(Loading).length;
          },
          200,
          5000,
        ))
      .then(() =>
        expect(component()
          .find('[id="PasswordResetPage.title"]')
          .first()
          .prop('values').name).to.equal('John Doe'));
  }).timeout(5000);

  it('renders an error', () => {
    const message = 'Test error';
    props.error = { message };

    expect(shallowComponent().contains(message)).to.equal(true);
  });
});
