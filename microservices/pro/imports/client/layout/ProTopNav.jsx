// @flow
import React from 'react';

import TopNav from 'core/components/TopNav';

type ProTopNavProps = {
  currentUser: Object,
};

const ProTopNav = ({ currentUser }: ProTopNavProps) => (
  <TopNav className="pro-top-nav" currentUser={currentUser} />
);

export default ProTopNav;
