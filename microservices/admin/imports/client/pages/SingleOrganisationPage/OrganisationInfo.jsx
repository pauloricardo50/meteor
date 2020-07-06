import React from 'react';

import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import AdminNote from 'core/components/AdminNote';
import UploaderArray from 'core/components/UploaderArray';

import CollectionTasksDataTable from '../../components/TasksDataTable/CollectionTasksDataTable';

const organisationDocuments = [{ id: 'OTHER', noTooltips: true }];

const OrganisationInfo = ({
  currentUser,
  adminNote,
  _id,
  documents,
  _collection,
}) => (
  <div>
    <AdminNote
      adminNote={adminNote}
      docId={_id}
      collection={ORGANISATIONS_COLLECTION}
      allowEditing
    />
    <UploaderArray
      doc={{ _id, _collection: ORGANISATIONS_COLLECTION, documents }}
      documentArray={organisationDocuments}
      currentUser={currentUser}
      allowRequireByAdmin={false}
      variant="simple"
    />
    <CollectionTasksDataTable
      docId={_id}
      collection={_collection}
      className="single-loan-page-tasks card1 card-top"
    />
  </div>
);

export default OrganisationInfo;
