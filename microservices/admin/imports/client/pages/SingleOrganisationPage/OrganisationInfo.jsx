//      
import React from 'react';

import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import UploaderArray from 'core/components/UploaderArray';
import AdminNote from 'core/components/AdminNote';

                                

const organisationDocuments = [{ id: 'OTHER', noTooltips: true }];

const OrganisationInfo = ({
  currentUser,
  adminNote,
  _id,
  documents,
}                       ) => (
  <div>
    <AdminNote
      adminNote={adminNote}
      docId={_id}
      collection={ORGANISATIONS_COLLECTION}
      allowEditing
    />
    <UploaderArray
      doc={{ _id, documents }}
      collection={ORGANISATIONS_COLLECTION}
      documentArray={organisationDocuments}
      currentUser={currentUser}
      allowRequireByAdmin={false}
      variant="simple"
    />
  </div>
);

export default OrganisationInfo;
