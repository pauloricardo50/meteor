import React from 'react';

import { LENDERS_COLLECTION } from 'core/api/lenders/lenderConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import AdminNote from 'core/components/AdminNote';
import { CollectionIconLink } from 'core/components/IconLink';
import StatusLabel from 'core/components/StatusLabel';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import LenderContact from './LenderContact';

const Lender = ({ lender }) => {
  const {
    organisation,
    status,
    contact,
    _id: lenderId,
    adminNote,
    _collection,
  } = lender;

  const { data, loading } = useStaticMeteorData(
    {
      query: !!organisation && ORGANISATIONS_COLLECTION,
      params: {
        $filters: { _id: organisation?._id },
        contacts: { name: 1, email: 1 },
      },
      type: 'single',
    },
    [organisation],
  );

  if (loading) {
    return null;
  }

  const { contacts = [] } = data || {};

  return (
    <div className="lender card1 card-top">
      <div className="flex center">
        <h3>
          <CollectionIconLink relatedDoc={organisation} />
        </h3>
        <StatusLabel
          status={status}
          collection={_collection}
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
