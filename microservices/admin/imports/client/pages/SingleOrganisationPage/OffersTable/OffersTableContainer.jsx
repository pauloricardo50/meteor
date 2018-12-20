import React from 'react';
import { compose, withProps } from 'recompose';

import T from 'imports/core/components/Translation/Translation';
import CollectionIconLink from 'imports/core/components/IconLink/CollectionIconLink';
import { LOANS_COLLECTION, CONTACTS_COLLECTION } from 'core/api/constants';
import { createRoute } from 'imports/core/utils/routerUtils';

const columnOptions = [
  { id: 'loanId', label: <T id="Forms.loan" /> },
  { id: 'contact', label: <T id="Forms.contact" /> },
];

const makeMapOffer = offer => {
  const {
    _id: offerId,
    lender: { contact, loan },
  } = offer;

  return {
    id: offerId,
    columns: [
      {
        raw: loan._id,
        label: (
          <CollectionIconLink
            relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
          />
        ),
      },
      {
        raw: contact,
        label: (
          <CollectionIconLink
            relatedDoc={{ ...contact, collection: CONTACTS_COLLECTION }}
          />
        ),
      },
    ],
  };
};

export default compose(
  withProps(({ offers = [] }) => ({
    rows: offers.map(makeMapOffer),
    columnOptions,
  })),
);
