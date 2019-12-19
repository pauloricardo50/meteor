// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { Money } from 'core/components/Translation';
import { propertyDelete } from 'core/api/methods/index';
import { ProPropertyModifier } from './ProPropertyForm';
import PropertyDocumentsManager from './PropertyDocumentsManager';
import StatusLabel from '../StatusLabel';
import { PROPERTIES_COLLECTION, ROLES } from '../../api/constants';
import ConfirmMethod from '../ConfirmMethod';

type ProPropertyPageHeaderProps = {
  property: Object,
};

const ProPropertyPageHeader = ({
  property,
  permissions,
}: ProPropertyPageHeaderProps) => {
  const { address, totalValue, _id: propertyId, status } = property;
  const { canModifyProperty } = permissions;
  const isDev = Meteor.user().roles.includes(ROLES.DEV);

  return (
    <div className="pro-property-page-header">
      <div className="flex-col">
        <div className="flex-row center space-children">
          <h1>{address}</h1>
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
            {isDev && (
              <ConfirmMethod
                buttonProps={{
                  label: 'Supprimer',
                  color: 'error',
                  outlined: true,
                }}
                method={() => propertyDelete.run({ propertyId })}
                keyword="SUPPRIMER"
              />
            )}
            <ProPropertyModifier property={property} />
            <PropertyDocumentsManager property={property} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProPropertyPageHeader;
