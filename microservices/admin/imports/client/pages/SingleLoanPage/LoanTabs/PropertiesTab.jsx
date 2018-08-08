// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import SinglePropertyPage from '../../SinglePropertyPage/SinglePropertyPage';

type PropertiesTabProps = {
  properties: Array<Object>,
  loan: Object,
};

const PropertiesTab = ({
  properties,
  loan: {
    general: { residenceType: loanResidenceType },
  },
}: PropertiesTabProps) => (
  <Tabs
    tabs={properties.map(property => ({
      id: property._id,
      label: property.address1,
      content: (
        <SinglePropertyPage
          propertyId={property._id}
          displayLoans={false}
          loanResidenceType={loanResidenceType}
        />
      ),
    }))}
  />
);

export default PropertiesTab;
