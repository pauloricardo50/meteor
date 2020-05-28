import React from 'react';
import moment from 'moment';
import { compose, withProps, withState } from 'recompose';

import withSmartQuery from '../../api/containerToolkit/withSmartQuery';
import { LOAN_STATUS } from '../../api/loans/loanConstants';
import { proLoans2 } from '../../api/loans/queries';
import { CollectionIconLink } from '../IconLink';
import ProCustomer from '../ProCustomer';
import StatusLabel from '../StatusLabel';
import T from '../Translation';
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

const makeMapLoan = ({ isAdmin }) => loan => {
  const {
    _collection,
    _id: loanId,
    anonymous,
    createdAt,
    name: loanName,
    proNote = {},
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
        label: isAdmin ? <CollectionIconLink relatedDoc={loan} /> : loanName,
      },
      {
        raw: status,
        label: <StatusLabel status={status} collection={_collection} />,
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
  withProps(({ loans, isAdmin = false }) => ({
    rows: loans.map(makeMapLoan({ isAdmin })),
    columnOptions,
  })),
);
