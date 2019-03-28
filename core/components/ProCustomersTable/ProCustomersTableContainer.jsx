import React from 'react';
import { compose, mapProps, withProps, withState } from 'recompose';
import moment from 'moment';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proLoans from 'core/api/loans/queries/proLoans';
import { getReferredBy } from 'core/api/helpers';
import T, { Money } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';

import LoanProgress from 'core/components/LoanProgress/LoanProgress';
import LoanProgressHeader from 'core/components/LoanProgress/LoanProgressHeader';
import {
  LOANS_COLLECTION,
  LOAN_STATUS,
  PROPERTIES_COLLECTION,
  PROMOTIONS_COLLECTION,
  RESIDENCE_TYPE,
} from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';
import { makeTableFiltersContainer } from 'core/containers/withTableFilters';

const columnOptions = [
  { id: 'loanName' },
  { id: 'status' },
  { id: 'progress', label: <LoanProgressHeader /> },
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'referredBy' },
  { id: 'maxPropertyValue' },
  { id: 'relatedTo' },
  // { id: 'estimatedRevenues' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`ProCustomersTable.${id}`} />,
}));

const makeMapLoan = ({ proUser, isAdmin }) => (loan) => {
  const {
    _id: loanId,
    status,
    user,
    createdAt,
    name: loanName,
    relatedTo: relatedDocs = [],
    loanProgress,
    estimatedRevenues,
    maxPropertyValue,
    residenceType,
  } = loan;

  return {
    id: loanId,
    columns: [
      {
        raw: loanName,
        label: isAdmin ? (
          <CollectionIconLink
            relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
          />
        ) : (
          loanName
        ),
      },
      {
        raw: status,
        label: <StatusLabel status={status} collection={LOANS_COLLECTION} />,
      },
      {
        raw: loanProgress.verificationStatus,
        label: <LoanProgress loanProgress={loanProgress} />,
      },
      user && user.name,
      user && user.phoneNumbers && user.phoneNumbers[0],
      user && user.email,
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
      getReferredBy({ user, proUser, isAdmin }),
      {
        raw:
          maxPropertyValue
          && (residenceType === RESIDENCE_TYPE.SECOND_RESIDENCE
            ? maxPropertyValue.second.propertyValue
            : maxPropertyValue.main.propertyValue),
        label: maxPropertyValue ? (
          residenceType === RESIDENCE_TYPE.SECOND_RESIDENCE ? (
            <Money value={maxPropertyValue.second.max.propertyValue} />
          ) : (
            <Money value={maxPropertyValue.main.max.propertyValue} />
          )
        ) : (
          'Pas encore calculé'
        ),
      },
      {
        raw: relatedDocs.length ? relatedDocs[0]._id : '-',
        label: relatedDocs.length
          ? relatedDocs.map(relatedDoc => (
            <CollectionIconLink
              key={relatedDoc._id}
              relatedDoc={relatedDoc}
            />
          ))
          : '-',
      },
      // {
      //   raw: estimatedRevenues,
      //   label: estimatedRevenues ? (
      //     <Money value={estimatedRevenues} />
      //   ) : (
      //     '-'
      //   ),
      // },
    ],
  };
};

const customersTableFilters = {
  filters: {
    status: true,
    relatedTo: [{ collection: true }],
  },
  options: {
    status: Object.values(LOAN_STATUS).map(id => ({ id, label: id })),
    collection: [PROPERTIES_COLLECTION, PROMOTIONS_COLLECTION].map(id => ({
      id,
      label: id,
    })),
  },
  labels: {
    status: 'Statut',
    relatedTo: 'Lien',
  },
};

export default compose(
  mapProps(({ proUser, ...props }) => {
    const { promotions = [], proProperties = [] } = proUser;
    return {
      ...props,
      proUser,
      propertyIds: proProperties.map(({ _id }) => _id),
      promotionIds: promotions.map(({ _id }) => _id),
      tableFilters: customersTableFilters,
    };
  }),
  withSmartQuery({
    query: proLoans,
    params: ({
      propertyIds,
      promotionIds,
      proUser: { _id: userId },
      isAdmin = false,
    }) => ({
      ...(isAdmin ? { userId } : {}),
      promotionId: { $in: promotionIds },
      propertyId: { $in: propertyIds },
    }),
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
  // makeTableFiltersContainer(undefined, 'loans'),
  withProps(({ loans, proUser, isAdmin = false }) => ({
    rows: loans.map(makeMapLoan({ proUser, isAdmin })),
    columnOptions,
  })),
);
