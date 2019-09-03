import React from 'react';

import SideNav from '../SideNav';

const adminLinks = [
  {
    link: '/',
    icon: <span className="icon fa fa-home fa-2x" />,
    label: 'Home',
  },
  {
    link: '/users',
    icon: <span className="icon fa fa-users fa-2x" />,
    label: 'Comptes',
  },
  {
    link: '/loans',
    icon: <span className="icon fa fa-files-o fa-2x" />,
    label: 'Demandes de prêt',
  },
];

const AdminNav = () => <SideNav links={adminLinks} />;

export default AdminNav;
