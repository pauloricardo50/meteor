import { Meteor } from 'meteor/meteor';

import React from 'react';

import { propertyDelete } from '../../api/methods/index';
import { PROPERTIES_COLLECTION } from '../../api/properties/propertyConstants';
import { ROLES } from '../../api/users/userConstants';
import ConfirmMethod from '../ConfirmMethod';
import StatusLabel from '../StatusLabel';
import { Money } from '../Translation';
import PropertyDocumentsManager from './PropertyDocumentsManager';
import { ProPropertyModifier } from './ProPropertyForm';

const ProPropertyPageHeader = ({ property, permissions }) => {
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
            <PropertyDocumentsManager
              property={property}
              canModifyProperty={canModifyProperty}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProPropertyPageHeader;
