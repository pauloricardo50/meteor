import React from 'react';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

import { BORROWERS_COLLECTION } from '../../../api/borrowers/borrowerConstants';
import { CONTACTS_COLLECTION } from '../../../api/contacts/contactsConstants';
import { INSURANCE_REQUESTS_COLLECTION } from '../../../api/insuranceRequests/insuranceRequestConstants';
import { getDuration, getFrequency } from '../../../api/insurances/helpers';
import { INSURANCES_COLLECTION } from '../../../api/insurances/insuranceConstants';
import {
  LOANS_COLLECTION,
  LOAN_CATEGORIES,
} from '../../../api/loans/loanConstants';
import { OFFERS_COLLECTION } from '../../../api/offers/offerConstants';
import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_FEATURES,
} from '../../../api/organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from '../../../api/promotions/promotionConstants';
import {
  PROPERTIES_COLLECTION,
  PROPERTY_CATEGORY,
} from '../../../api/properties/propertyConstants';
import { USERS_COLLECTION } from '../../../api/users/userConstants';
import colors from '../../../config/colors';
import FullDate from '../../dateComponents/FullDate';
import PremiumBadge from '../../PremiumBadge';
import RolesList from '../../RolesList';
import StatusLabel from '../../StatusLabel';
import TooltipArray from '../../TooltipArray';
import T, { IntlDate, Money } from '../../Translation';
import CollectionIconLink from '../CollectionIconLink';

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

const LinkList = ({ docs }) => (
  <TooltipArray
    items={docs.map(doc => (
      <CollectionIconLink key={doc._id} relatedDoc={doc} />
    ))}
    displayLimit={2}
    className="flex wrap"
  />
);

export const titles = {
  [LOANS_COLLECTION]: ({ name, status, category, _collection }) => (
    <span>
      {name}
      &nbsp;
      <StatusLabel status={status} collection={_collection} />
      {category === LOAN_CATEGORIES.PREMIUM && (
        <span>
          &nbsp;
          <PremiumBadge />
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
      <RolesList className="secondary" roles={roles} />
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
  [PROPERTIES_COLLECTION]: ({
    address1,
    name,
    status,
    category,
    _collection,
  }) => (
    <span>
      {name || address1 || 'Bien immobilier sans nom'}
      &nbsp;
      {category === PROPERTY_CATEGORY.PRO && <b>(PRO)</b>}
      {category === PROPERTY_CATEGORY.PROMOTION && <b>(PROMO)</b>}
      &nbsp;
      {status && <StatusLabel status={status} collection={_collection} />}
    </span>
  ),
  [OFFERS_COLLECTION]: ({
    lender: {
      loan: { name },
      organisation: { name: orgName },
    },
  }) => (
    <span>
      {orgName}
      &nbsp;pour
      {name}
    </span>
  ),
  [PROMOTIONS_COLLECTION]: ({ name, status, _collection }) => (
    <span>
      {name}
      &nbsp;
      <StatusLabel status={status} collection={_collection} />
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
  [INSURANCES_COLLECTION]: ({ name, status, _collection }) => (
    <span>
      {name}
      &nbsp;
      <StatusLabel status={status} collection={_collection} />
    </span>
  ),
  [INSURANCE_REQUESTS_COLLECTION]: ({ name, status, _collection }) => (
    <span>
      {name}
      &nbsp;
      <StatusLabel status={status} collection={_collection} />
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
    mainAssignee,
  }) => {
    const structure = structures.find(({ id }) => id === selectedStructure);
    const [promotion] = promotions;

    return (
      <div>
        {children}

        <Information
          label="Promotion"
          value={<CollectionIconLink relatedDoc={promotion} />}
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
          value={<CollectionIconLink relatedDoc={user} />}
          isEmpty={!user || !user._id}
          emptyText="Sans compte"
        />

        <Information
          label="Conseiller"
          value={<CollectionIconLink relatedDoc={mainAssignee} />}
          isEmpty={!mainAssignee}
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
          value={<CollectionIconLink relatedDoc={assignedEmployee} />}
          isEmpty={!assignedEmployee}
        />

        <Information
          label="Référé par compte"
          value={<CollectionIconLink relatedDoc={referredByUser} />}
          isEmpty={!referredByUser.name}
        />

        <Information
          label="Référé par organisation"
          value={<CollectionIconLink relatedDoc={referredByOrganisation} />}
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
        value={<CollectionIconLink relatedDoc={user} />}
        isEmpty={!user}
        emptyText="Sans compte"
      />

      {!!user && (
        <Information
          label="Conseiller"
          value={<CollectionIconLink relatedDoc={user.assignedEmployee} />}
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
                    _collection: ORGANISATIONS_COLLECTION,
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
        value={<CollectionIconLink relatedDoc={lenderOrganisation} />}
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
  [INSURANCE_REQUESTS_COLLECTION]: ({
    children,
    borrowers = [],
    user,
    mainAssignee,
  }) => (
    <div>
      {children}

      <Information
        label="Assurés"
        value={<LinkList docs={borrowers} collection={BORROWERS_COLLECTION} />}
        isEmpty={borrowers.length === 0}
      />

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
              ...mainAssignee,
              collection: USERS_COLLECTION,
            }}
          />
        }
        isEmpty={!mainAssignee}
      />
    </div>
  ),
  [INSURANCES_COLLECTION]: ({
    borrower,
    insuranceProduct,
    organisation,
    children,
    premium,
    premiumFrequency,
    duration,
  }) => {
    const { name: productName } = insuranceProduct;
    return (
      <div>
        {children}

        <Information
          label="Assuré"
          value={
            <CollectionIconLink
              relatedDoc={{ ...borrower, collection: BORROWERS_COLLECTION }}
            />
          }
        />
        <Information
          label="Assureur"
          value={
            <CollectionIconLink
              relatedDoc={{
                ...organisation,
                collection: ORGANISATIONS_COLLECTION,
              }}
            />
          }
        />
        <Information label="Produit" value={productName} />
        <Information
          label="Prime"
          value={
            <span>
              <Money value={premium} />
              {getFrequency(premiumFrequency)}
            </span>
          }
        />
        <Information
          label="Durée"
          value={getDuration({ premiumFrequency, duration })}
        />
      </div>
    );
  },
};
