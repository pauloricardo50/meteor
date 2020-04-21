import React from 'react';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import PercentWithStatus from 'core/components/PercentWithStatus';
import { PropertyAdder } from 'core/components/PropertyForm';
import Tabs from 'core/components/Tabs';
import Calculator from 'core/utils/Calculator';

import SinglePropertyPage from '../../../SinglePropertyPage';

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

const PropertiesTab = ({ loan }) => {
  const { properties, userId, _id: loanId, hasPromotion, purchaseType } = loan;
  return (
    <div className="properties-tab">
      {hasPromotion &&
        'Peut pas avoir de biens immobilier sur un dossier avec une promotion.'}
      <div className="buttons">
        <PropertyAdder
          loanId={loanId}
          userId={userId}
          disabled={hasPromotion}
          isRefinancing={purchaseType === PURCHASE_TYPE.REFINANCING}
        />
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
