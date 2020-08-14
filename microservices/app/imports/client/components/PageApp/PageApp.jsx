import React from 'react';

import Page from 'core/components/Page';

import { useSideNavContext } from '../../layouts/AppLayout/SideNavContext';

const PageApp = props => (
  <Page {...props} shouldShowSideNav={useSideNavContext()} />
);

export default PageApp;
