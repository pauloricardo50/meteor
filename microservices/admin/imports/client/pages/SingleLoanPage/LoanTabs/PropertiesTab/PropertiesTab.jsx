// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import PercentWithStatus from 'core/components/PercentWithStatus';
import { PropertyAdder, PropertyReuser } from 'core/components/PropertyForm';
import Calculator from 'core/utils/Calculator';
import SinglePropertyPage from '../../../SinglePropertyPage';

type PropertiesTabProps = {
  loan: Object,
};

const propertiesTabLabel = (loan, property, index) => {
  const progress = Calculator.propertyPercent({ loan, property });
  return (
    <span className="single-loan-page-tabs-label">
      {property.address1 || `Bien immo ${index + 1}`}
      &nbsp;&bull;&nbsp;
      <PercentWithStatus
        status={progress < 1 ? null : undefined}
        value={progress}
        rounded
      />
    </span>
  );
};

const PropertiesTab = ({ loan }: PropertiesTabProps) => {
  const { properties, userId, _id: loanId, hasPromotion } = loan;
  return (
    <div className="properties-tab">
      {hasPromotion &&
        'Peut pas avoir de biens immobilier sur un dossier avec une promotion.'}
      <div className="buttons">
        <PropertyAdder
          loanId={loanId}
          propertyUserId={userId}
          disabled={hasPromotion}
        />
        {userId && (
          <PropertyReuser
            loanId={loanId}
            propertyUserId={userId}
            disabled={hasPromotion}
          />
        )}
      </div>
      {properties && properties.length > 0 && (
        <Tabs
          tabs={properties.map((property, index) => ({
            id: property._id,
            label: propertiesTabLabel(loan, property, index),
            content: (
              <SinglePropertyPage
                key={property._id}
                propertyId={property._id}
                displayLoans={false}
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
