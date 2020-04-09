import React from 'react';

import ProProperty from '../ProProperty';
import ProPropertyPageContainer from './ProPropertyPageContainer';
import ProPropertyPageCustomers from './ProPropertyPageCustomers';
import ProPropertyPageHeader from './ProPropertyPageHeader';
import ProPropertyPageUsers from './ProPropertyPageUsers';

export const ProPropertyPage = ({ property, permissions, currentUser }) => (
  <div className="pro-property-page">
    <ProPropertyPageHeader property={property} permissions={permissions} />
    <ProPropertyPageUsers property={property} permissions={permissions} />
    <ProPropertyPageCustomers
      property={property}
      permissions={permissions}
      currentUser={currentUser}
    />
    <ProProperty property={property} />
  </div>
);

export default ProPropertyPageContainer(ProPropertyPage);
