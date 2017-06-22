import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/std:accounts-ui';
import { analytics } from 'meteor/okgrow:analytics';

const styles = {
  section: {
    paddingTop: 100,
    display: 'table',
    position: 'absolute',
    width: '100%',
    height: 'calc(100% - 64px)',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'scroll',
    backgroundRepeat: 'no-repeat no-repeat',
    backgroundSize: 'cover',
  },
  div1: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  div2: {
    margin: 'auto',
    display: 'block',
    maxWidth: 500,
    paddingLeft: 16,
    paddingRight: 16,
  },
};

const handlePasswordReset = () => {
  console.log('jejes');
};

const LoginPage = props =>
  <section style={styles.section}>
    <div style={styles.div1}>
      <div style={styles.div2}>
        <Accounts.ui.LoginForm
          onSignedInHook={() => props.history.push('/app')}
          onPostSignUpHook={() => {
            props.history.push('/app');

            Meteor.call('sendVerificationLink', (error, response) => {
              if (error) {
                console.log(error);
              }
              console.log(response);
            });

            // Create user for analytics
            analytics.identify(Meteor.userId(), {
              email: Meteor.user().emails[0].address,
              id: Meteor.userId(),
            });
          }}
          onResetPasswordHook={handlePasswordReset}
        />
      </div>
    </div>
  </section>;

LoginPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoginPage;
