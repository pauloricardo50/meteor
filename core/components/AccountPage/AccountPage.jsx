import { Meteor } from 'meteor/meteor';

import PropTypes from 'prop-types';
import React from 'react';

import T from '../Translation';
import Page from '../Page';
import PasswordChange from './PasswordChange';
import AccountResetter from '../AccountResetter/AccountResetter';

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

const AccountPage = ({ currentUser: { email, _id: userId } }) => (
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

        <div className="form-group">
          <h4 style={styles.h}>
            <T id="AccountPage.password" />
          </h4>
          <br />
          <PasswordChange />
        </div>

        {email === 'y@nnis.ch' && <AccountResetter userId={userId} />}
      </div>
    </div>
  </Page>
);

AccountPage.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AccountPage;
