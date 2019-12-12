import React from 'react';
import { compose, withProps, withState } from 'recompose';
import moment from 'moment';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proLoans2 } from 'core/api/loans/queries';
import T from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import ProCustomer from 'core/components/ProCustomer';
import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';
import ProCustomersTableAssigneeInfo from './ProCustomersTableAssigneeInfo';

const columnOptions = [
  { id: 'loanName', style: { whiteSpace: 'nowrap' } },
  { id: 'status' },
  { id: 'customer' },
  { id: 'createdAt' },
  { id: 'relatedTo' },
  { id: 'proNote' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`ProCustomersTable.${id}`} />,
}));

const makeMapLoan = ({ proUser, isAdmin }) => loan => {
  const {
    _id: loanId,
    anonymous,
    createdAt,
    name: loanName,
    referredByText,
    relatedTo: relatedDocs = [],
    status,
    user,
    proNote = {},
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
      {
        raw: !!proNote.note,
        label: (
          <ProCustomersTableAssigneeInfo
            proNote={proNote}
            user={user}
            loanId={loanId}
            anonymous={anonymous}
          />
        ),
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
        name: 1,
        proNote: 1,
        referredByText: 1,
        relatedTo: 1,
        status: 1,
        user: {
          name: 1,
          phoneNumbers: 1,
          email: 1,
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
