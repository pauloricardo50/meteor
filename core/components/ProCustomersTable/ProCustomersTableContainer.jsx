import React from 'react';
import { compose, withProps, withState } from 'recompose';
import moment from 'moment';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proLoans2 } from 'core/api/loans/queries';
import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import ProCustomer from 'core/components/ProCustomer';
import LoanProgress from 'core/components/LoanProgress';
import LoanProgressHeader from 'core/components/LoanProgress/LoanProgressHeader';
import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';

const columnOptions = [
  { id: 'loanName', style: { whiteSpace: 'nowrap' } },
  { id: 'status' },
  { id: 'progress', label: <LoanProgressHeader /> },
  { id: 'customer' },
  { id: 'createdAt' },
  { id: 'relatedTo' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`ProCustomersTable.${id}`} />,
}));

const makeMapLoan = ({ proUser, isAdmin }) => loan => {
  const {
    _id: loanId,
    anonymous,
    createdAt,
    loanProgress,
    name: loanName,
    referredByText,
    relatedTo: relatedDocs = [],
    status,
    user,
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
        raw: loanProgress.info + loanProgress.documents,
        label: <LoanProgress loanProgress={loanProgress} />,
      },
      {
        raw: !anonymous && user.name,
        label: anonymous ? (
          'Anonyme'
        ) : (
          <ProCustomer user={user} invitedByUser={referredByText} />
        ),
      },
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
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
    ],
  };
};

const getAnonymous = withAnonymous =>
  withAnonymous ? undefined : { $in: [null, false] };

export default compose(
  withState('status', 'setStatus', {
    $in: Object.values(LOAN_STATUS).filter(
      s => s !== LOAN_STATUS.UNSUCCESSFUL && s !== LOAN_STATUS.TEST,
    ),
  }),
  withState('withAnonymous', 'setWithAnonymous', false),
  withState('referredByMe', 'setReferredByMe', true),
  withSmartQuery({
    query: proLoans2,
    params: ({
      proUser: { _id: userId },
      isAdmin = false,
      status,
      withAnonymous,
      referredByMe,
    }) => ({
      ...(isAdmin ? { userId } : {}),
      status,
      anonymous: getAnonymous(withAnonymous),
      referredByMe,
      referredByMyOrganisation: !referredByMe,
      $body: {
        anonymous: 1,
        createdAt: 1,
        loanProgress: 1,
        name: 1,
        referredByText: 1,
        relatedTo: 1,
        status: 1,
        user: {
          name: 1,
          phoneNumbers: 1,
          assignedEmployee: { name: 1, email: 1, phoneNumbers: 1 },
        },
      },
    }),
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
  withProps(({ loans, proUser, isAdmin = false }) => ({
    rows: loans.map(makeMapLoan({ proUser, isAdmin })),
    columnOptions,
  })),
);
