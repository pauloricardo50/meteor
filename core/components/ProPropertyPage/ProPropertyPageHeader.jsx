// @flow
import React from 'react';

import { Money } from 'core/components/Translation';
import { ProPropertyModifier } from './ProPropertyForm';
import PropertyDocumentsManager from './PropertyDocumentsManager';
import PropertyCustomerAdder from './PropertyCustomerAdder';

type ProPropertyPageHeaderProps = {
  property: Object,
};

const ProPropertyPageHeader = ({ property }: ProPropertyPageHeaderProps) => {
  const { address1, totalValue, _id: propertyId } = property;

  return (
    <div className="pro-property-page-header">
      <div className="flex-col">
        <h1>{address1}</h1>
        <h3 className="secondary">
          <Money value={totalValue} />
        </h3>
      </div>
      <ProPropertyModifier property={property} />
      <PropertyDocumentsManager property={property} />
      <PropertyCustomerAdder propertyId={propertyId} />
    </div>
  );
};

export default ProPropertyPageHeader;
