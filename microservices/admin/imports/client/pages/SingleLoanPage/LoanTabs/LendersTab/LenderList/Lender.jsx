//
import React from 'react';

import {
  LENDERS_COLLECTION,
  ORGANISATIONS_COLLECTION,
} from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import AdminNote from 'core/components/AdminNote';
import LenderContact from './LenderContact';

const Lender = ({ lender }) => {
  const {
    organisation,
    status,
    contact,
    _id: lenderId,
    offers = [],
    adminNote,
  } = lender;
  // Organisation is undefined at the start, before grapher data settles down
  if (!organisation) {
    return null;
  }

  const { contacts = [] } = organisation;

  return (
    <div className="lender card1 card-top">
      <div className="flex center">
        <h3>
          <CollectionIconLink
            relatedDoc={{
              ...organisation,
              collection: ORGANISATIONS_COLLECTION,
            }}
          />
        </h3>
        <StatusLabel
          status={status}
          collection={LENDERS_COLLECTION}
          allowModify
          docId={lenderId}
        />
      </div>

      <LenderContact
        contact={contact}
        contacts={contacts}
        lenderId={lenderId}
      />
      <AdminNote
        docId={lenderId}
        adminNote={adminNote}
        collection={LENDERS_COLLECTION}
        placeholder="#### Ajouter un commentaire"
        allowEditing
      />
    </div>
  );
};

export default Lender;
