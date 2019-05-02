import React from 'react';

import {
  LOANS_COLLECTION,
  USERS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  OFFERS_COLLECTION,
  PROMOTIONS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  CONTACTS_COLLECTION,
} from '../../../api/constants';
import StatusLabel from '../../StatusLabel';
import Roles from '../../Roles';
import { Money, IntlDate } from '../../Translation';

export const titles = {
  [LOANS_COLLECTION]: ({ name, status }) => (
    <span>
      {name} <StatusLabel status={status} collection={LOANS_COLLECTION} />
    </span>
  ),
  [USERS_COLLECTION]: ({ name, roles }) => (
    <span>
      {name} <Roles className="secondary" roles={roles} />
    </span>
  ),
  [BORROWERS_COLLECTION]: ({ name }) => <span>{name}</span>,
  [PROPERTIES_COLLECTION]: ({ address1, name, status }) => (
    <span>
      {name || address1}{' '}
      {status && (
        <StatusLabel status={status} collection={PROPERTIES_COLLECTION} />
      )}
    </span>
  ),
  [OFFERS_COLLECTION]: ({
    lender: {
      loan: { name },
      organisation: { name: orgName, logo },
    },
  }) => (
    <span>
      {orgName} pour {name}
    </span>
  ),
  [PROMOTIONS_COLLECTION]: ({ name, status }) => (
    <span>
      {name} <StatusLabel status={status} collection={PROMOTIONS_COLLECTION} />
    </span>
  ),
  [ORGANISATIONS_COLLECTION]: ({ name, type }) => (
    <span>
      {name} <span className="secondary">{type}</span>
    </span>
  ),
  [CONTACTS_COLLECTION]: ({ name, organisations = [] }) => (
    <span>
      {name}{' '}
      <span className="secondary">
        {organisations.length > 0 && organisations[0].name}
      </span>
    </span>
  ),
};

export const components = {
  [LOANS_COLLECTION]: ({ user, structures = [], selectedStructure }) => {
    const structure = structures.find(({ id }) => id === selectedStructure);

    return (
      <span>
        <span>
          Hypothèque:{' '}
          {structure ? (
            <b>
              <Money value={structure.wantedLoan} />
            </b>
          ) : (
            '-'
          )}
        </span>
        <br />
        {user && user.name}
        <br />
        Conseiller:{' '}
        {user && user.assignedEmployee ? user.assignedEmployee.name : '-'}
      </span>
    );
  },
  [USERS_COLLECTION]: ({ email, phoneNumber, assignedEmployee }) => (
    <span>
      {email}
      <br />
      {phoneNumber}
      <br />
      Conseiller: {assignedEmployee ? assignedEmployee.name : '-'}
    </span>
  ),
  [BORROWERS_COLLECTION]: ({ user, loans = [] }) => (
    <span>
      {user && user.name}
      <br />
      Conseiller:{' '}
      {user && user.assignedEmployee ? user.assignedEmployee.name : '-'}
      <br />
      Dossiers: {loans.map(({ name }) => name).join(', ')}
    </span>
  ),
  [PROPERTIES_COLLECTION]: ({ totalValue }) => (
    <span>
      <Money value={totalValue} />
    </span>
  ),
  [OFFERS_COLLECTION]: ({ maxAmount, feedback }) => (
    <span>
      <Money value={maxAmount} />
      <br />
      Feedback:{' '}
      {feedback && feedback.date ? (
        <span className="success">
          Donné <IntlDate type="relative" value={feedback.date} />
        </span>
      ) : (
        <span>Non</span>
      )}
    </span>
  ),
  [PROMOTIONS_COLLECTION]: ({
    availablePromotionLots,
    bookedPromotionLots,
    soldPromotionLots,
  }) => (
    <span>
      Lots: {availablePromotionLots.length}
      <br />
      Réservés: {bookedPromotionLots.length}
      <br />
      Vendus: {soldPromotionLots.length}
    </span>
  ),
  [ORGANISATIONS_COLLECTION]: ({ logo }) => (
    <span>
      {logo && (
        <div style={{ width: 100, height: 50 }}>
          <img src={logo} style={{ maxWidth: 100, maxHeight: 50 }} />
        </div>
      )}
    </span>
  ),
  [CONTACTS_COLLECTION]: ({ organisations = [], email, phoneNumber }) => (
    <span>
      {organisations.length > 0 && organisations[0].$metadata.title}
      <br />
      {email}
      <br />
      {phoneNumber}
    </span>
  ),
};
