// @flow
import React from 'react';

import AccountPageBare from 'core/components/AccountPage/AccountPageBare';
import PageApp from '../../components/PageApp';

type AppAccountPageProps = {};

const AppAccountPage = (props: AppAccountPageProps) => (
  <PageApp id="AccountPage">
    <AccountPageBare {...props} />
  </PageApp>
);

export default AppAccountPage;
