import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';

import T from 'core/components/Translation';
import colors from 'core/config/colors';

const handleClick = (event, props) => {
  event.preventDefault();
  Meteor.call('sendVerificationLink', (error, response) => {
    if (error) {
      const message = props.intl.formatMessage({ id: 'errors.general' });
      message.error(message, 5);
    } else {
      const email = Meteor.user().emails[0].address;
      const message = props.intl.formatMessage(
        { id: 'bert.emailVerificationSent' },
        { email },
      );
      message.success(message, 5);
    }
  });
};

const DashboardUnverified = props => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
    }}
    className="card1 card-top"
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexGrow: 1,
      }}
    >
      <h3 className="fixed-size" style={{ margin: 0 }}>
        <T id="DashboardUnverified.title" />
      </h3>
      <div style={{ display: 'flex' }}>
        <p style={{ margin: 0 }}>
          <T id="DashboardUnverified.description" />{' '}
          <a className="color" onClick={e => handleClick(e, props)}>
            <T id="DashboardUnverified.CTA" />
          </a>
        </p>
      </div>
    </div>
    <span
      className="fa fa-info fa-2x"
      style={{ color: colors.borderGrey, paddingRight: 16, paddingLeft: 16 }}
    />
  </div>
);

DashboardUnverified.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(DashboardUnverified);
