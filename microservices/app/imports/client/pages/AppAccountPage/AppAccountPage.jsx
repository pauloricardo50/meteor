//      
import React from 'react';

import AccountPageBare from 'core/components/AccountPage/AccountPageBare';
import PageApp from '../../components/PageApp';

                              

const AppAccountPage = (props                     ) => (
  <PageApp id="AccountPage">
    <AccountPageBare {...props} />
  </PageApp>
);

export default AppAccountPage;
