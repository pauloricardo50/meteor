import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import { Bert } from 'meteor/themeteorchef:bert';
import { injectIntl } from 'react-intl';

import { T } from '/imports/ui/components/general/Translation';
import colors from '/imports/js/config/colors';

const handleClick = (event, props) => {
  event.preventDefault();
  Meteor.call('sendVerificationLink', (error, response) => {
    if (error) {
      console.log(error);
      const message = props.intl.formatMessage({ id: 'error.general' });
      Bert.alert(`<h3 style="color:white;margin:0;">${message}</h3>`, 'danger');
    } else {
      const email = Meteor.user().emails[0].address;
      const message = props.intl.formatMessage(
        { id: 'bert.emailVerificationSent' },
        { email },
      );
      Bert.alert(
        `<h3 style="color:white;margin:0;">${message}</h3>`,
        'success',
      );
    }
  });
};

const Unverified = props =>
  (<div
    style={{
      display: 'flex',
      alignItems: 'center',
    }}
    className="mask1"
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
          <a onClick={e => handleClick(e, props)}>
            <T id="DashboardUnverified.CTA" />
          </a>
        </p>
      </div>
    </div>
    <span
      className="fa fa-info fa-2x"
      style={{ color: colors.lightBorder, paddingRight: 16, paddingLeft: 16 }}
    />
  </div>);

Unverified.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(Unverified);
