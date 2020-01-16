// @flow
/* eslint-env mocha */
import { Random } from 'meteor/random';

import { expect } from 'chai';
import { Redirect } from 'react-router-dom';

import { resetDatabase } from 'core/utils/testHelpers/testHelpers';
import { testCreateUser } from '../../../../api';
import { getMountedComponent } from '../../../../utils/testHelpers';
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
  const dumbComponent = () =>
    getMountedComponent({
      Component: PasswordResetPageDumb,
      props,
      withRouter: true,
    });

  beforeEach(() => {
    getMountedComponent.reset();
    props = { token: Random.id(), email: 'john.doe@test.com' };
    return resetDatabase();
  });

  it.skip('renders the name', async () => {
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

    expect(dumbComponent().find(Redirect).length).to.equal(1);
  });

  it('renders a loader if the user is loading', () => {
    expect(dumbComponent().find(Loading).length).to.equal(1);
  });

  it('requests all fields if the user only has an email address', () => {
    props = {
      user: { email: 'yo@test.com' },
    };

    expect(dumbComponent().find('input[name="firstName"]').length).to.equal(1);
    expect(dumbComponent().find('input[name="lastName"]').length).to.equal(1);
    expect(dumbComponent().find('input[name="phoneNumber"]').length).to.equal(
      1,
    );
    expect(dumbComponent().find('input[name="newPassword"]').length).to.equal(
      1,
    );
    expect(dumbComponent().find('input[name="newPassword2"]').length).to.equal(
      1,
    );
    expect(
      dumbComponent().find('input[name="hasReadPrivacyPolicy"]').length,
    ).to.equal(0);
  });

  it('requests firstName field if it is not provided, and a divider', () => {
    props = {
      user: { lastName: 'Jackson', phoneNumbers: ['12345'] },
    };

    expect(dumbComponent().find('input[name="firstName"]').length).to.equal(1);
    expect(dumbComponent().find('input[name="lastName"]').length).to.equal(0);
    expect(dumbComponent().find('input[name="phoneNumber"]').length).to.equal(
      0,
    );
    expect(dumbComponent().find('input[name="newPassword"]').length).to.equal(
      1,
    );
    expect(dumbComponent().find('input[name="newPassword2"]').length).to.equal(
      1,
    );

    expect(dumbComponent().find('hr').length).to.equal(1);
  });

  it('renders a hidden username field', () => {
    props = {
      user: { email: 'yo@test.com' },
    };

    const input = dumbComponent().find('input[name="username"]');
    expect(input.length).to.equal(1);
    expect(input.first().prop('style')).to.deep.equal({ display: 'none' });
    expect(input.first().prop('value')).to.equal('yo@test.com');
  });

  it('does not render a divider if only the password is needed', () => {
    it('requests firstName field if it is not provided', () => {
      props = {
        user: {
          firstName: 'Joe',
          lastName: 'Jackson',
          phoneNumbers: ['12345'],
        },
      };

      expect(dumbComponent().find('hr').length).to.equal(0);
    });
  });

  it('renders a privacy policy disclaimer if the user is enrolling his account', () => {
    props = {
      pathname: 'www.e-potek.ch/enroll-account/token',
      user: { email: 'yo@test.com' },
    };

    expect(
      dumbComponent().find('input[name="hasReadPrivacyPolicy"]').length,
    ).to.equal(1);
  });

  it('does not render a privacy policy disclaimer if the user is resetting his password', () => {
    props = {
      pathname: 'www.e-potek.ch/reset-password/token',
      user: { email: 'yo@test.com' },
    };

    expect(
      dumbComponent().find('input[name="hasReadPrivacyPolicy"]').length,
    ).to.equal(0);
  });

  it('does not submit the form if password do not match', () => {
    props = {
      user: {
        firstName: 'Joe',
        lastName: 'Jackson',
        phoneNumbers: ['12345'],
      },
      handleSubmit: () => Promise.resolve(),
    };

    const input1 = dumbComponent()
      .find('input[name="newPassword"]')
      .at(0);
    const input2 = dumbComponent()
      .find('input[name="newPassword2"]')
      .at(0);

    input1.instance().value = '12345678';
    input1.simulate('change');
    input2.instance().value = '123456789';
    input2.simulate('change');

    dumbComponent()
      .find('form')
      .first()
      .simulate('submit');

    expect(
      dumbComponent()
        .find('button')
        .last()
        .prop('disabled'),
    ).to.equal(true);

    expect(
      dumbComponent()
        .find('[name="newPassword2"]')
        .first()
        .text(),
    ).to.include('newPassword2 is invalid');
  });
});
