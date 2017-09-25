import PropTypes from 'prop-types';
import React from 'react';
import { addUserTracking } from '/imports/js/helpers/analytics';

import { T } from '/imports/ui/components/general/Translation';
import Accounts from './Accounts';

const styles = {
  section: {
    width: '100%',
    minHeight: 'calc(100% - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    overflowY: 'scroll',
    padding: '0 16px',
  },
};

const handlePasswordReset = () => {
  console.log('jejes');
};

const LoginPage = () => (
  <section style={styles.section}>
    <h1>
      <T id="LoginPage.title" />
    </h1>
    <Accounts.ui.LoginForm />
  </section>
);

LoginPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoginPage;
