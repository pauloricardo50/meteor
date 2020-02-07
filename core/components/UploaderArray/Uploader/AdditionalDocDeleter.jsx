import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';

import { ROLES, PROPERTIES_COLLECTION } from 'core/api/constants';
import { pullPropertyValue, pullBorrowerValue } from 'core/api';
import ConfirmMethod from 'core/components/ConfirmMethod';

const AdditionalDocDeleter = ({
  isAdditionalDoc,
  id,
  label: keyword,
  collection,
  docId,
}) => {
  const userIsAdmin =
    Roles.userIsInRole(Meteor.user(), ROLES.DEV) ||
    Roles.userIsInRole(Meteor.user(), ROLES.ADMIN);

  if (isAdditionalDoc && userIsAdmin) {
    return (
      <ConfirmMethod
        keyword={keyword}
        label="[ADMIN] Supprimer"
        method={() => {
          const object = { additionalDocuments: { id } };
          if (collection === PROPERTIES_COLLECTION) {
            return pullPropertyValue.run({ propertyId: docId, object });
          }

          return pullBorrowerValue.run({ borrowerId: docId, object });
        }}
        buttonProps={{ className: 'additional-doc-deleter', outlined: true }}
      />
    );
  }

  return null;
};

export default AdditionalDocDeleter;
