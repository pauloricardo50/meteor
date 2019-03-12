// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import { PropertyAdder, PropertyReuser } from 'core/components/PropertyForm';
import Calculator from 'core/utils/Calculator';
import { percentFormatters } from 'core/utils/formHelpers';
import SinglePropertyPage from '../../SinglePropertyPage/SinglePropertyPage';

type PropertiesTabProps = {
  loan: Object,
};

const propertiesTabLabel = (loan, property, index) => {
  const progress = Calculator.propertyPercent({ loan, property });
  return `${property.address1
    || `Bien immo ${index + 1}`} - ${percentFormatters.format(progress)}%`;
};

const PropertiesTab = ({ loan }: PropertiesTabProps) => {
  const {
    properties,
    userId,
    _id: loanId,
    residenceType: loanResidenceType,
  } = loan;
  return (
    <div className="properties-tab">
      <div className="buttons">
        <PropertyAdder loanId={loanId} propertyUserId={userId} />
        <PropertyReuser loanId={loanId} propertyUserId={userId} />
      </div>
      {properties && properties.length > 0 && (
        <Tabs
          tabs={properties.map((property, index) => ({
            id: property._id,
            label: propertiesTabLabel(loan, property, index),
            content: (
              <SinglePropertyPage
                propertyId={property._id}
                displayLoans={false}
                loanResidenceType={loanResidenceType}
                loanId={loanId}
              />
            ),
          }))}
        />
      )}
    </div>
  );
};

export default PropertiesTab;
