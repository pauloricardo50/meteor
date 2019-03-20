// @flow
import React from 'react';

import { Money } from 'core/components/Translation';
import { ProPropertyModifier } from './ProPropertyForm';
import PropertyDocumentsManager from './PropertyDocumentsManager';
import StatusLabel from '../StatusLabel';
import { PROPERTIES_COLLECTION } from '../../api/constants';

type ProPropertyPageHeaderProps = {
  property: Object,
};

const ProPropertyPageHeader = ({
  property,
  permissions,
}: ProPropertyPageHeaderProps) => {
  const { address1, totalValue, _id: propertyId, status } = property;
  const { canModifyProperty } = permissions;

  return (
    <div className="pro-property-page-header">
      <div className="flex-col">
        <div className="flex-row center space-children">
          <h1>{address1}</h1>
          <StatusLabel
            status={status}
            collection={PROPERTIES_COLLECTION}
            allowModify={canModifyProperty}
            docId={propertyId}
          />
        </div>
        <h3 className="secondary">
          <Money value={totalValue} />
        </h3>
      </div>

      <div className="pro-property-page-header-buttons">
        {canModifyProperty && (
          <>
            <ProPropertyModifier property={property} />
            <PropertyDocumentsManager property={property} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProPropertyPageHeader;
