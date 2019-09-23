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
  LOAN_CATEGORIES,
  PROPERTY_CATEGORY,
} from '../../../api/constants';
import StatusLabel from '../../StatusLabel';
import Roles from '../../Roles';
import PremiumBadge from '../../PremiumBadge';
import T, { Money, IntlDate } from '../../Translation';
import CollectionIconLink from '../CollectionIconLink';
import TooltipArray from '../../TooltipArray';

export const titles = {
  [LOANS_COLLECTION]: ({ name, status, category }) => (
    <span>
      {name}
      &nbsp;
      <StatusLabel status={status} collection={LOANS_COLLECTION} />
      {category === LOAN_CATEGORIES.PREMIUM && (
        <span>
          &nbsp;
          <PremiumBadge small />
        </span>
      )}
    </span>
  ),
  [USERS_COLLECTION]: ({ name, roles }) => (
    <span>
      {name}
      &nbsp;
      <Roles className="secondary" roles={roles} />
    </span>
  ),
  [BORROWERS_COLLECTION]: ({ name }) => (
    <span>{name || 'Emprunteur sans nom'}</span>
  ),
  [PROPERTIES_COLLECTION]: ({ address1, name, status, category }) => (
    <span>
      {name || address1 || 'Bien immobilier sans nom'}
      &nbsp;
      {category === PROPERTY_CATEGORY.PRO && <b>(PRO)</b>}
      &nbsp;
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
      &nbsp;pour
      {name}
    </span>
  ),
  [PROMOTIONS_COLLECTION]: ({ name, status }) => (
    <span>
      {name}
      &nbsp;
      <StatusLabel status={status} collection={PROMOTIONS_COLLECTION} />
    </span>
  ),
  [ORGANISATIONS_COLLECTION]: ({ name, type }) => (
    <span>
      {name}
      &nbsp;
      <span className="secondary">
        <T id={`Forms.type.${type}`} />
      </span>
    </span>
  ),
  [CONTACTS_COLLECTION]: ({ name, organisations = [] }) => (
    <span>
      {name}
      &nbsp;
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
          &nbsp;
          {structure ? <Money value={structure.wantedLoan} /> : '-'}
        </div>
        {anonymous && <div>Anonyme</div>}

        <div className="flex center-align">
          <b>Compte:</b>
          &nbsp;
          {user ? (
            <CollectionIconLink
              relatedDoc={{ ...user, collection: USERS_COLLECTION }}
            />
          ) : (
            '-'
          )}
        </div>

        <div className="flex center-align">
          <b>Conseiller:</b>
          &nbsp;
          <span>
            {user && user.assignedEmployee ? (
              <CollectionIconLink
                relatedDoc={{
                  ...user.assignedEmployee,
                  collection: USERS_COLLECTION,
                }}
              />
            ) : (
              '-'
            )}
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
    loans = [],
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
        <div className="flex center-align">
          <b>Conseiller:</b>
          &nbsp;
          <span>
            {assignedEmployee ? (
              <CollectionIconLink
                relatedDoc={{
                  ...assignedEmployee,
                  collection: USERS_COLLECTION,
                }}
              />
            ) : (
              '-'
            )}
          </span>
        </div>

        <div className="flex center-align">
          <b>Référé par compte:</b>
          &nbsp;
          {referredByUser.name ? (
            <CollectionIconLink
              relatedDoc={{
                ...referredByUser,
                collection: USERS_COLLECTION,
              }}
            />
          ) : (
            '-'
          )}
        </div>

        <div className="flex center-align">
          <b>Référé par organisation:</b>
          &nbsp;
          {referredByOrganisation.name ? (
            <CollectionIconLink
              relatedDoc={{
                ...referredByOrganisation,
                collection: ORGANISATIONS_COLLECTION,
              }}
            />
          ) : (
            '-'
          )}
        </div>

        <div className="flex center-align">
          <b>Dossiers:</b>
          {loans.map(loan => (
            <CollectionIconLink
              key={loan._id}
              relatedDoc={{
                ...loan,
                collection: LOANS_COLLECTION,
              }}
            />
          ))}
        </div>
      </div>
    );
  },
  [BORROWERS_COLLECTION]: ({ user, loans = [], children }) => (
    <div>
      {children}
      {user && (
        <CollectionIconLink
          relatedDoc={{ ...user, collection: USERS_COLLECTION }}
        />
      )}
      <div className="flex center-align">
        <b>Conseiller:</b>
        &nbsp;
        {user && user.assignedEmployee ? (
          <CollectionIconLink
            relatedDoc={{
              ...user.assignedEmployee,
              collection: USERS_COLLECTION,
            }}
          />
        ) : (
          '-'
        )}
      </div>
      <div className="flex center-align">
        <b>Dossiers:</b>
        {loans.map(loan => (
          <CollectionIconLink
            key={loan._id}
            relatedDoc={{
              ...loan,
              collection: LOANS_COLLECTION,
            }}
          />
        ))}
      </div>
    </div>
  ),
  [PROPERTIES_COLLECTION]: ({
    totalValue,
    children,
    category,
    users = [],
    loans = [],
  }) => {
    const allOrgs = users.reduce(
      (orgs, { organisations = [] }) => [...orgs, ...organisations],
      [],
    );
    const uniqueOrganisation = allOrgs.every(({ _id: orgId }) => orgId === allOrgs[0]._id);
    const isPro = category === PROPERTY_CATEGORY.PRO;

    return (
      <div>
        {children}
        <div className="flex-col">
          {isPro && uniqueOrganisation && (
            <>
              <b>Organisation</b>
              <CollectionIconLink
                key={allOrgs[0]._id}
                relatedDoc={{
                  _id: allOrgs[0]._id,
                  name: allOrgs[0].name,
                  collection: ORGANISATIONS_COLLECTION,
                }}
              />
            </>
          )}
          {isPro && (
            <>
              <b>Dossiers</b>
              <TooltipArray
                title="Dossiers"
                items={loans.map(loan => (
                  <CollectionIconLink
                    key={loan._id}
                    relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
                  />
                ))}
                displayLimit={2}
              />
            </>
          )}
          <b>Prix d'achat</b>
          <Money value={totalValue} />
        </div>
      </div>
    );
  },
  [OFFERS_COLLECTION]: ({ maxAmount, feedback, children }) => (
    <div>
      {children}
      <Money value={maxAmount} />
      <div>
        <b>Feedback:</b>
        &nbsp;
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
        <div className="flex center-align">
          <b>Prêteur:</b>
          &nbsp;
          <b>
            <CollectionIconLink
              relatedDoc={{
                ...lenderOrganisation,
                collection: ORGANISATIONS_COLLECTION,
              }}
            />
          </b>
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
      {organisations.length > 0 && (
        <CollectionIconLink
          relatedDoc={{
            ...organisations[0],
            collection: ORGANISATIONS_COLLECTION,
          }}
        />
      )}
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
