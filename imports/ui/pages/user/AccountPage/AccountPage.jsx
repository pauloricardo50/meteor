import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import Button from '/imports/ui/components/general/Button.jsx';

import Page from '/imports/ui/components/general/Page.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';
import PasswordChange from './PasswordChange.jsx';

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
          {/* <a><T id="AccountPage.change" /></a> */}
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

        {/* <div className="form-group">
          <h4 style={styles.h}><T id="AccountPage.phone" /></h4><a><T id="AccountPage.change" /></a>
          <br />
          <p className="secondary">+41 78 000 00 00</p>
        </div> */}

        {/* <div className="form-group">
          <h4 style={styles.h}>Langue</h4><a>Changer</a>
          <br />
          <p className="secondary">Français</p>
        </div> */}

        {/* <div className="form-group">
          <h4><T id="AccountPage.notifications" /></h4>
          <Checkbox label={<T id="AccountPage.notifications.email" />} style={{ zIndex: 1 }} />
          <Checkbox label={<T id="AccountPage.notifications.sms" />} style={{ zIndex: 1 }} />
        </div> */}
      </div>
    </div>
  </Page>
);

AccountPage.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AccountPage;
