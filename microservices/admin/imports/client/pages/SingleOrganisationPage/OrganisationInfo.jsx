import React from 'react';

import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import AdminNote from 'core/components/AdminNote';
import UploaderArray from 'core/components/UploaderArray';

import CollectionTasksTable from '../../components/TasksTable/CollectionTasksTable';

const organisationDocuments = [{ id: 'OTHER', noTooltips: true }];

const OrganisationInfo = ({ currentUser, adminNote, _id, documents }) => (
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
    <CollectionTasksTable
      doc={{ _id }}
      collection={ORGANISATIONS_COLLECTION}
      withTaskInsert
    />
  </div>
);

export default OrganisationInfo;
