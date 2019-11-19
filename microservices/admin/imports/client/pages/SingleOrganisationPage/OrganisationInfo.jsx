// @flow
import React from 'react';

import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import UploaderArray from 'core/components/UploaderArray';
import AdminNote from 'core/components/AdminNote';

type OrganisationInfoProps = {};

const organisationDocuments = [{ id: 'OTHER', noTooltips: true }];

const OrganisationInfo = ({
  currentUser,
  adminNote,
  _id,
  documents,
}: OrganisationInfoProps) => (
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
    />
  </div>
);

export default OrganisationInfo;
