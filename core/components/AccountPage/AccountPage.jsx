import React from 'react';
import PropTypes from 'prop-types';

import Page from '../Page';
import AccountPageBare from './AccountPageBare';

const AccountPage = props => (
  <Page id="AccountPage">
    <AccountPageBare {...props} />
  </Page>
);

AccountPage.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default AccountPage;
