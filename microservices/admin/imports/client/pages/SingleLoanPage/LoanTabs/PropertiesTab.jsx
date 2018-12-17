// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import { PropertyAdder } from 'core/components/PropertyForm';
import SinglePropertyPage from '../../SinglePropertyPage/SinglePropertyPage';

type PropertiesTabProps = {
  loan: Object,
};

const PropertiesTab = ({
  loan: { properties, userId, _id: loanId, residenceType: loanResidenceType },
}: PropertiesTabProps) => (
  <div className="properties-tab">
    <PropertyAdder loanId={loanId} propertyUserId={userId} />
    {properties && properties.length > 0 && (
      <Tabs
        tabs={properties.map((property, index) => ({
          id: property._id,
          label: property.address1 || `Bien immo ${index + 1}`,
          content: (
            <SinglePropertyPage
              propertyId={property._id}
              displayLoans={false}
              loanResidenceType={loanResidenceType}
            />
          ),
        }))}
      />
    )}
  </div>
);

export default PropertiesTab;
