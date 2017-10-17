import React from 'react';

import SideNav from '../general/SideNav';

const adminLinks = [
  {
    link: '/admin',
    icon: <span className="icon fa fa-home fa-2x" />,
    label: 'Home',
  },
  {
    link: '/admin/users',
    icon: <span className="icon fa fa-users fa-2x" />,
    label: 'Utilisateurs',
  },
  {
    link: '/admin/requests',
    icon: <span className="icon fa fa-files-o fa-2x" />,
    label: 'Demandes de prêt',
  },
];

const AdminNav = () => <SideNav links={adminLinks} />;

export default AdminNav;
