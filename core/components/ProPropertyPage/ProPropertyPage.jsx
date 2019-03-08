// @flow
import React from 'react';
import ProPropertyPageHeader from './ProPropertyPageHeader';
import ProPropertyPageUsers from './ProPropertyPageUsers';
import ProPropertyPageCustomers from './ProPropertyPageCustomers';
import ProProperty from '../ProProperty';
import ProPropertyPageContainer from './ProPropertyPageContainer';

type ProPropertyPageProps = {};

export const ProPropertyPage = ({
  property,
  permissions,
  currentUser,
}: ProPropertyPageProps) => (
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
