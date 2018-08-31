// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import { PropertyAdder } from 'core/components/PropertyForm';
import SinglePropertyPage from '../../SinglePropertyPage/SinglePropertyPage';

type PropertiesTabProps = {
  properties: Array<Object>,
  loan: Object,
};

const PropertiesTab = ({
  properties,
  loan: {
    _id: loanId,
    general: { residenceType: loanResidenceType },
  },
}: PropertiesTabProps) => (
  <div className="properties-tab">
    <PropertyAdder loanId={loanId} />
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
  </div>
);

export default PropertiesTab;
