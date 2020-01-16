import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

import colors from '../../../config/colors';
import Calculator from '../../../utils/Calculator';
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
  ORGANISATION_FEATURES,
} from '../../../api/constants';
import StatusLabel from '../../StatusLabel';
import Roles from '../../Roles';
import PremiumBadge from '../../PremiumBadge';
import T, { Money, IntlDate } from '../../Translation';
import CollectionIconLink from '../CollectionIconLink';
import TooltipArray from '../../TooltipArray';
import FullDate from '../../dateComponents/FullDate';

const Information = ({
  label,
  value,
  shouldDisplay = true,
  isEmpty,
  emptyText = '-',
}) => {
  if (!shouldDisplay) {
    return null;
  }

  return (
    <div className="flex center-align wrap">
      {label && (
        <>
          <b>{label}:</b>
          &nbsp;
        </>
      )}
      {isEmpty ? <span className="secondary">{emptyText}</span> : value}
    </div>
  );
};

const LinkList = ({ docs, collection }) => (
  <TooltipArray
    items={docs.map(doc => (
      <CollectionIconLink key={doc._id} relatedDoc={{ ...doc, collection }} />
    ))}
    displayLimit={2}
    className="flex wrap"
  />
);

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
  [USERS_COLLECTION]: ({ name, roles, isDisabled }) => (
    <span>
      {isDisabled && (
        <p className="flex center error-box m-0 mb-8">Désactivé</p>
      )}
      {name}
      &nbsp;
      <Roles className="secondary" roles={roles} />
    </span>
  ),
  [BORROWERS_COLLECTION]: ({ name, age }) => (
    <span>
      {name || 'Emprunteur sans nom'}
      &nbsp;
      {age > 0 && (
        <>
          <span>{`- ${age} ans`}</span>
          &nbsp;
        </>
      )}
      <span className="secondary">Emprunteur</span>
    </span>
  ),
  [PROPERTIES_COLLECTION]: ({ address1, name, status, category }) => (
    <span>
      {name || address1 || 'Bien immobilier sans nom'}
      &nbsp;
      {category === PROPERTY_CATEGORY.PRO && <b>(PRO)</b>}
      {category === PROPERTY_CATEGORY.PROMOTION && <b>(PROMO)</b>}
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
    user = {},
    structures = [],
    selectedStructure,
    anonymous,
    children,
    borrowers = [],
    promotions = [],
  }) => {
    const structure = structures.find(({ id }) => id === selectedStructure);
    const [promotion] = promotions;

    return (
      <div>
        {children}

        <Information
          label="Promotion"
          value={
            <CollectionIconLink
              relatedDoc={{ ...promotion, collection: PROMOTIONS_COLLECTION }}
            />
          }
          shouldDisplay={!!promotion}
        />

        <Information
          label="Emprunteurs"
          value={
            <LinkList docs={borrowers} collection={BORROWERS_COLLECTION} />
          }
          isEmpty={borrowers.length === 0}
        />

        <Information
          label="Hypothèque"
          value={<Money value={structure && structure.wantedLoan} />}
          isEmpty={!structure}
        />

        <Information label="Anonyme" value="Yep!" shouldDisplay={!!anonymous} />

        <Information
          className="flex center-align"
          label="Compte"
          value={
            <CollectionIconLink
              relatedDoc={{ ...user, collection: USERS_COLLECTION }}
            />
          }
          isEmpty={!user || !user._id}
          emptyText="Sans compte"
        />

        <Information
          label="Conseiller"
          value={
            <CollectionIconLink
              relatedDoc={{
                ...user.assignedEmployee,
                collection: USERS_COLLECTION,
              }}
            />
          }
          isEmpty={!(user && user.assignedEmployee)}
        />
      </div>
    );
  },
  [USERS_COLLECTION]: ({
    email,
    phoneNumbers = [],
    assignedEmployee,
    children,
    referredByUser = {},
    referredByOrganisation = {},
    emails = [],
    loans = [],
    organisations = [],
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
          <TooltipArray
            title="Numéros de téléphone"
            items={phoneNumbers.map(number => (
              <a key={number} href={`tel:${number}`}>
                <span>
                  {number}
                  &nbsp;
                </span>
              </a>
            ))}
          />
        </div>

        <Information
          label="Organisations"
          value={
            <LinkList
              docs={organisations}
              collection={ORGANISATIONS_COLLECTION}
            />
          }
          shouldDisplay={organisations.length > 0}
        />

        <Information
          label="Conseiller"
          value={
            <CollectionIconLink
              relatedDoc={{
                ...assignedEmployee,
                collection: USERS_COLLECTION,
              }}
            />
          }
          isEmpty={!assignedEmployee}
        />

        <Information
          label="Référé par compte"
          value={
            <CollectionIconLink
              relatedDoc={{
                ...referredByUser,
                collection: USERS_COLLECTION,
              }}
            />
          }
          isEmpty={!referredByUser.name}
        />

        <Information
          label="Référé par organisation"
          value={
            <CollectionIconLink
              relatedDoc={{
                ...referredByOrganisation,
                collection: ORGANISATIONS_COLLECTION,
              }}
            />
          }
          isEmpty={!referredByOrganisation.name}
        />

        <Information
          label="Dossiers"
          value={<LinkList docs={loans} collection={LOANS_COLLECTION} />}
          shouldDisplay={loans.length > 0}
        />
      </div>
    );
  },
  [BORROWERS_COLLECTION]: ({
    user,
    loans = [],
    children,
    salary = 0,
    bankFortune = [],
  }) => (
    <div>
      {children}
      <Information
        label="Salaire brut"
        value={<Money value={salary} />}
        isEmpty={salary === 0}
      />

      <Information
        label="Fortune bancaire"
        value={
          <Money
            value={bankFortune.reduce((total, { value }) => total + value, 0)}
          />
        }
        isEmpty={
          bankFortune.reduce((total, { value }) => total + value, 0) === 0
        }
      />

      <Information
        label="Compte"
        value={
          <CollectionIconLink
            relatedDoc={{ ...user, collection: USERS_COLLECTION }}
          />
        }
        isEmpty={!user}
        emptyText="Sans compte"
      />

      {!!user && (
        <Information
          label="Conseiller"
          value={
            <CollectionIconLink
              relatedDoc={{
                ...user.assignedEmployee,
                collection: USERS_COLLECTION,
              }}
            />
          }
          isEmpty={!(user && user.assignedEmployee)}
        />
      )}

      <Information
        label="Dossiers"
        value={<LinkList docs={loans} collection={LOANS_COLLECTION} />}
        isEmpty={loans.length === 0}
      />
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
    const uniqueOrganisation = allOrgs.every(
      ({ _id: orgId }) => orgId === allOrgs[0]._id,
    );
    const isPro = category === PROPERTY_CATEGORY.PRO;

    return (
      <div>
        {children}
        <div className="flex-col">
          {!!(isPro && uniqueOrganisation) && (
            <Information
              label="Organisation"
              value={
                <CollectionIconLink
                  key={allOrgs[0]._id}
                  relatedDoc={{
                    _id: allOrgs[0]._id,
                    name: allOrgs[0].name,
                    collection: ORGANISATIONS_COLLECTION,
                  }}
                />
              }
              shouldDisplay={isPro && uniqueOrganisation}
            />
          )}

          <Information
            label="Dossiers"
            value={<LinkList docs={loans} collection={LOANS_COLLECTION} />}
            isEmpty={loans.length === 0}
            shouldDisplay={isPro}
          />

          <Information
            label="Prix d'achat"
            value={<Money value={totalValue} />}
          />
        </div>
      </div>
    );
  },
  [OFFERS_COLLECTION]: ({ maxAmount, feedback, children, createdAt }) => (
    <div>
      {children}
      <Information label="Date" value={<FullDate date={createdAt} />} />

      <Information label="Prêt maximal" value={<Money value={maxAmount} />} />

      <Information
        label="Feedback"
        value={
          <span className="success">
            Donné <IntlDate type="relative" value={feedback.date} />
          </span>
        }
        isEmpty={!(feedback && feedback.date)}
      />
    </div>
  ),
  [PROMOTIONS_COLLECTION]: ({
    availablePromotionLots,
    reservedPromotionLots,
    soldPromotionLots,
    lenderOrganisation,
    children,
    signingDate,
  }) => (
    <div>
      {children}
      <Information
        label="Prêteur"
        value={
          <CollectionIconLink
            relatedDoc={{
              ...lenderOrganisation,
              collection: ORGANISATIONS_COLLECTION,
            }}
          />
        }
        isEmpty={!lenderOrganisation}
        emptyText="Pas choisi"
      />

      <Information label="Lots dispo" value={availablePromotionLots.length} />
      <Information label="Lots réservés" value={reservedPromotionLots.length} />
      <Information label="Lots vendus" value={soldPromotionLots.length} />

      <Information
        label={<T id="Forms.signingDate" />}
        value={moment(signingDate).format('DD.MM.YYYY')}
        isEmpty={!signingDate}
      />
    </div>
  ),
  [ORGANISATIONS_COLLECTION]: ({
    logo,
    offerCount,
    children,
    features = [],
    users = [],
    referredCustomers = [],
    contacts = [],
  }) => (
    <div>
      {children}

      <Information
        value={
          <div style={{ width: 100, height: 50 }}>
            <img src={logo} style={{ maxWidth: 100, maxHeight: 50 }} />
          </div>
        }
        shouldDisplay={!!logo}
      />

      <Information
        label="Comptes"
        value={<LinkList docs={users} collection={USERS_COLLECTION} />}
        shouldDisplay={users.length > 0}
      />

      <Information
        label="Contacts"
        value={<LinkList docs={contacts} collection={CONTACTS_COLLECTION} />}
        shouldDisplay={contacts.length > 0}
      />

      <Information
        label="Clients référés"
        value={referredCustomers.length}
        shouldDisplay={features.includes(ORGANISATION_FEATURES.PRO)}
      />

      <Information
        label="Offres faites"
        value={offerCount}
        shouldDisplay={features.includes(ORGANISATION_FEATURES.LENDER)}
      />
    </div>
  ),
  [CONTACTS_COLLECTION]: ({
    organisations = [],
    email,
    phoneNumbers = [],
    children,
  }) => (
    <div>
      {children}

      <Information
        label="Organisation"
        value={
          <CollectionIconLink
            relatedDoc={{
              ...organisations[0],
              collection: ORGANISATIONS_COLLECTION,
            }}
          />
        }
        isEmpty={organisations.length === 0}
      />

      <Information
        label="Rôle"
        value={organisations[0] && organisations[0].$metadata.title}
        shouldDisplay={organisations.length > 0}
      />

      <Information
        label="Email"
        value={
          <a
            className="color"
            href={`mailto:${email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {email}
          </a>
        }
      />

      <Information
        label="Tél"
        value={
          <TooltipArray
            title="Numéros de téléphone"
            items={phoneNumbers.map(number => (
              <a key={number} href={`tel:${number}`}>
                <span>
                  {number}
                  &nbsp;
                </span>
              </a>
            ))}
          />
        }
        isEmpty={phoneNumbers.length === 0}
      />
    </div>
  ),
};
