import React from 'react';

import SideNav from '../components/general/SideNav.jsx';

const UserLayout = ({ content, extraContent }) => (
  <div>
    {extraContent}
    <SideNav />
    <main className="user-layout">
      {content}
    </main>
  </div>
);

export default UserLayout;
