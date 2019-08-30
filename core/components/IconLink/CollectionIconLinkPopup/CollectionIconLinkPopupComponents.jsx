import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

import colors from 'core/config/colors';
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
import T, { Money, IntlDate } from '../../Translation';

export const titles = {
  [LOANS_COLLECTION]: ({ name, status }) => (
    <span>
      {name}
      {' '}
      <StatusLabel status={status} collection={LOANS_COLLECTION} />
    </span>
  ),
  [USERS_COLLECTION]: ({ name, roles }) => (
    <span>
      {name}
      {' '}
      <Roles className="secondary" roles={roles} />
    </span>
  ),
  [BORROWERS_COLLECTION]: ({ name }) => (
    <span>{name || 'Emprunteur sans nom'}</span>
  ),
  [PROPERTIES_COLLECTION]: ({ address1, name, status }) => (
    <span>
      {name || address1 || 'Bien immobilier sans nom'}
      {' '}
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
      {orgName}
      {' '}
pour
      {name}
    </span>
  ),
  [PROMOTIONS_COLLECTION]: ({ name, status }) => (
    <span>
      {name}
      {' '}
      <StatusLabel status={status} collection={PROMOTIONS_COLLECTION} />
    </span>
  ),
  [ORGANISATIONS_COLLECTION]: ({ name, type }) => (
    <span>
      {name}
      {' '}
      <span className="secondary">
        <T id={`Forms.type.${type}`} />
      </span>
    </span>
  ),
  [CONTACTS_COLLECTION]: ({ name, organisations = [] }) => (
    <span>
      {name}
      {' '}
      <span className="secondary">
        {organisations.length > 0 && organisations[0].name}
      </span>
    </span>
  ),
};

export const components = {
  [LOANS_COLLECTION]: ({
    user,
    structures = [],
    selectedStructure,
    anonymous,
    children,
    borrowers = [],
  }) => {
    const structure = structures.find(({ id }) => id === selectedStructure);

    return (
      <div>
        {children}
        {borrowers.length > 0 && (
          <div>
            <b>Emprunteurs</b>
            <ul style={{ margin: 0 }}>
              {borrowers.map(({ _id, name }, index) => (
                <li key={_id}>{name || `Emprunteur ${index + 1}`}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <b>Hypothèque:</b>
          {' '}
          {structure ? <Money value={structure.wantedLoan} /> : '-'}
        </div>
        {anonymous && <div>Anonyme</div>}
        {user && (
          <div>
            <b>Compte:</b>
            {' '}
            {user.name}
          </div>
        )}
        <div>
          <b>Conseiller:</b>
          {' '}
          <span>
            {user && user.assignedEmployee ? user.assignedEmployee.name : '-'}
          </span>
        </div>
      </div>
    );
  },
  [USERS_COLLECTION]: ({
    email,
    phoneNumber,
    assignedEmployee,
    children,
    referredByUser = {},
    referredByOrganisation = {},
    emails = [],
  }) => {
    const emailVerified = !!emails.length && emails[0].verified;

    return (
      <div>
        {children}
        <div>
          <a
            className="color"
            href={`mailto:${email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {email}
          </a>
          <Tooltip
            title={
              emailVerified
                ? "Cette adresse email a été vérifiée, le client s'est connecté avec."
                : "Cette adresse email n'a pas été vérifiée, le client ne s'est pas connecté avec."
            }
          >
            <FontAwesomeIcon
              icon={emailVerified ? faCheckCircle : faExclamationCircle}
              style={{
                marginLeft: '4px',
                color: emailVerified ? colors.success : colors.warning,
              }}
            />
          </Tooltip>
        </div>
        <div>
          <a className="color" href={`tel:${phoneNumber}`}>
            {phoneNumber}
          </a>
        </div>
        <div>
          <b>Conseiller:</b>
          {' '}
          <span>{assignedEmployee ? assignedEmployee.name : '-'}</span>
        </div>
        {(referredByUser.name || referredByOrganisation.name) && (
          <div>
            <b>Référé par:</b>
            {' '}
            <span>
              {[referredByUser.name, referredByOrganisation.name]
                .filter(x => x)
                .join(' - ')}
            </span>
          </div>
        )}
      </div>
    );
  },
  [BORROWERS_COLLECTION]: ({ user, loans = [], children }) => (
    <div>
      {children}
      {user && <div>{user.name}</div>}
      <div>
        <b>Conseiller:</b>
        {' '}
        {user && user.assignedEmployee ? user.assignedEmployee.name : '-'}
      </div>
      <div>
        <b>Dossiers:</b>
        {loans.map(({ name }) => name).join(', ')}
      </div>
    </div>
  ),
  [PROPERTIES_COLLECTION]: ({ totalValue, children }) => (
    <div>
      {children}
      <Money value={totalValue} />
    </div>
  ),
  [OFFERS_COLLECTION]: ({ maxAmount, feedback, children }) => (
    <div>
      {children}
      <Money value={maxAmount} />
      <div>
        <b>Feedback:</b>
        {' '}
        {feedback && feedback.date ? (
          <span className="success">
            Donné
            {' '}
            <IntlDate type="relative" value={feedback.date} />
          </span>
        ) : (
          <span>Non</span>
        )}
      </div>
    </div>
  ),
  [PROMOTIONS_COLLECTION]: ({
    availablePromotionLots,
    bookedPromotionLots,
    soldPromotionLots,
    lenderOrganisation,
    children,
    signingDate,
  }) => (
    <div>
      {children}
      {lenderOrganisation && (
        <div>
          <b>Prêteur:</b>
          {' '}
          <b>{lenderOrganisation.name}</b>
        </div>
      )}
      <div>
        <b>Lots dispo:</b>
        {' '}
        {availablePromotionLots.length}
      </div>
      <div>
        <b>Réservés:</b>
        {' '}
        {bookedPromotionLots.length}
      </div>
      <div>
        <b>Vendus:</b>
        {' '}
        {soldPromotionLots.length}
      </div>
      {signingDate && (
        <div>
          <b>
            <T id="Forms.signingDate" />
            {':'}
          </b>
          {' '}
          {moment(signingDate).format('DD.MM.YYYY')}
        </div>
      )}
    </div>
  ),
  [ORGANISATIONS_COLLECTION]: ({ logo, offerCount, children }) => (
    <div>
      {children}
      {logo && (
        <div style={{ width: 100, height: 50 }}>
          <img src={logo} style={{ maxWidth: 100, maxHeight: 50 }} />
        </div>
      )}
      {offerCount > 0 && (
        <div>
          <b>Offres:</b>
          {' '}
          {offerCount}
        </div>
      )}
    </div>
  ),
  [CONTACTS_COLLECTION]: ({
    organisations = [],
    email,
    phoneNumber,
    children,
  }) => (
    <div>
      {children}
      <div>{organisations.length > 0 && organisations[0].$metadata.title}</div>
      <div>
        <a
          className="color"
          href={`mailto:${email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {email}
        </a>
      </div>
      <div>
        <a className="color" href={`tel:${phoneNumber}`}>
          {phoneNumber}
        </a>
      </div>
    </div>
  ),
};
