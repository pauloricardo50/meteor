import React from 'react';
import moment from 'moment';

import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import BorrowersSummary from 'core/components/BorrowersSummary';
import Link from 'core/components/Link';
import StatusLabel from 'core/components/StatusLabel';

const InsuranceRequestSummary = ({ insuranceRequest }) => {
  const {
    _collection,
    _id: insuranceRequestId,
    name,
    borrowers = [],
    status,
    createdAt,
    updatedAt,
  } = insuranceRequest;

  return (
    <Link
      to={`/insuranceRequests/${insuranceRequestId}`}
      className="card1 card-top card-hover flex-col mb-16"
    >
      <h4 className="mb-16">{name}</h4>
      <div className="flex-row sb">
        <div className="flex-col">
          <b>Status</b>
          <StatusLabel status={status} collection={_collection} />
        </div>
        <div className="flex-col">
          <b>Créé le</b>
          <p>{moment(createdAt).format('D MMM YY à HH:mm:ss')}</p>
        </div>
        <div className="flex-col">
          <b>Modifié le</b>
          <p>{moment(updatedAt).format('D MMM YY à HH:mm:ss')}</p>
        </div>
      </div>
      <div className="flex">
        <BorrowersSummary
          borrowers={borrowers}
          title="Assurés"
          emptyState="Pas d'assurés pour ce dossier"
          className="mr-16"
        />
      </div>
    </Link>
  );
};

export default InsuranceRequestSummary;
