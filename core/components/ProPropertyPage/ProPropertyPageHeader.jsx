// @flow
import React from 'react';

import { Money } from 'core/components/Translation';
import { ProPropertyModifier } from './ProPropertyForm';
import PropertyDocumentsManager from './PropertyDocumentsManager';
import PropertyCustomerAdder from './PropertyCustomerAdder';
import StatusLabel from '../StatusLabel';
import { PROPERTIES_COLLECTION } from '../../api/constants';

type ProPropertyPageHeaderProps = {
  property: Object,
};

const ProPropertyPageHeader = ({ property }: ProPropertyPageHeaderProps) => {
  const { address1, totalValue, _id: propertyId, status } = property;

  return (
    <div className="pro-property-page-header">
      <div className="flex-col">
        <div className="flex-row center space-children">
          <h1>{address1}</h1>
          <StatusLabel
            status={status}
            collection={PROPERTIES_COLLECTION}
            allowModify
            docId={propertyId}
          />
        </div>
        <h3 className="secondary">
          <Money value={totalValue} />
        </h3>
      </div>

      <div className="pro-property-page-header-buttons">
        <ProPropertyModifier property={property} />
        <PropertyDocumentsManager property={property} />
        <PropertyCustomerAdder propertyId={propertyId} />
      </div>
    </div>
  );
};

export default ProPropertyPageHeader;
