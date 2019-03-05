import { Meteor } from 'meteor/meteor';

import PropTypes from 'prop-types';
import React from 'react';

import T from '../Translation';
import Page from '../Page';
import AccountResetter from '../AccountResetter/AccountResetter';
import PasswordChange from './PasswordChange';
import DeveloperSection from './DeveloperSection';

const styles = {
  section: {
    position: 'relative',
  },
  h: {
    display: 'inline-block',
    marginRight: 5,
  },
  div: {
    paddingLeft: 20,
    paddingRight: 20,
  },
};

const AccountPage = ({ currentUser }) => {
  const { email, _id: userId } = currentUser;
  return (
    <Page id="AccountPage" topFullWidth={Meteor.microservice === 'pro'}>
      <div className="card1 card-top" style={styles.section}>
        <div style={styles.div}>
          <div className="form-group">
            <h4 style={styles.h}>
              <T id="AccountPage.email" />
            </h4>
            <br />
            <p className="secondary">{email}</p>
          </div>

          <div className="account-page-buttons">
            <PasswordChange />
            {Meteor.microservice === 'pro' && (
              <DeveloperSection user={currentUser} />
            )}
          </div>

          {email === 'y@nnis.ch' && <AccountResetter userId={userId} />}
        </div>
      </div>
    </Page>
  );
};

AccountPage.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AccountPage;
