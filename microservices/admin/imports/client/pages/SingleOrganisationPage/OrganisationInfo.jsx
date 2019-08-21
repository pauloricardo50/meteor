// @flow
import React from 'react';

import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import AdminNote from '../../components/AdminNote';

type OrganisationInfoProps = {};

const OrganisationInfo = ({ adminNote, _id }: OrganisationInfoProps) => (
  <div>
    <AdminNote
      adminNote={adminNote}
      docId={_id}
      collection={ORGANISATIONS_COLLECTION}
    />
  </div>
);

export default OrganisationInfo;
