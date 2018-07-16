import { Meteor } from 'meteor/meteor';

import PropTypes from 'prop-types';
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import Page from '../../components/Page';
import PasswordChange from './PasswordChange';

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
  mobileLogoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
};

const AccountPage = props => (
  <Page id="AccountPage">
    <div className="mask1" style={styles.section}>
      <span
        className="hidden-sm hidden-md hidden-lg"
        style={styles.mobileLogoutButton}
      >
        <Button
          raised
          label={<T id="general.logout" />}
          onClick={() => Meteor.logout(() => props.history.push('/home'))}
        />
      </span>

      <div style={styles.div}>
        <div className="form-group">
          <h4 style={styles.h}>
            <T id="AccountPage.email" />
          </h4>
          <br />
          <p className="secondary">{props.currentUser.emails[0].address}</p>
        </div>

        <div className="form-group">
          <h4 style={styles.h}>
            <T id="AccountPage.password" />
          </h4>
          <br />
          <PasswordChange />
        </div>
      </div>
    </div>
  </Page>
);

AccountPage.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.object.isRequired,
};

export default AccountPage;
