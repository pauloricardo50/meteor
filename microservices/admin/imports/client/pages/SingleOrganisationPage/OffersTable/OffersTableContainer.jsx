import React from 'react';
import { compose, withProps } from 'recompose';

import T from 'core/components/Translation';
import { CollectionIconLink } from 'core/components/IconLink';
import { LOANS_COLLECTION, CONTACTS_COLLECTION } from 'core/api/constants';

const columnOptions = [
  { id: 'loanId', label: <T id="Forms.loan" /> },
  { id: 'contact', label: <T id="Forms.contact" /> },
];

const makeMapOffer = ({ _id: offerId, lender: { contact, loan } }) => ({
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
});

export default compose(withProps(({ offers = [] }) => ({
  rows: offers.map(makeMapOffer),
  columnOptions,
})));
