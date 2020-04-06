import React from 'react';
import moment from 'moment';
import { compose, withProps, withState } from 'recompose';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import DialogSimple from 'core/components/DialogSimple';
import HtmlPreview from 'core/components/HtmlPreview';
import { CollectionIconLink } from 'core/components/IconLink';
import OfferDocuments from 'core/components/OfferList/OfferDocuments';
import StatusLabel from 'core/components/StatusLabel';
import T from 'core/components/Translation';

const columnOptions = [
  { id: 'createdAt', label: <T id="offer.createdAt" /> },
  { id: 'loanId', label: <T id="Forms.loan" /> },
  { id: 'status', label: <T id="Forms.status" /> },
  { id: 'contact', label: <T id="Forms.contact" /> },
  { id: 'feedback', label: <T id="Forms.feedback" /> },
  { id: 'documents', label: <T id="Forms.documents" /> },
];

const makeMapOffer = ({ setOfferDialog }) => offer => {
  const {
    _id: offerId,
    createdAt,
    lender: { contact, loan },
    feedback,
  } = offer;
  return {
    id: offerId,
    columns: [
      {
        raw: createdAt,
        label: moment(createdAt).format('DD.MM.YYYY'),
      },
      {
        raw: loan.name,
        label: <CollectionIconLink relatedDoc={loan} />,
      },
      {
        raw: loan.status,
        label: (
          <StatusLabel status={loan.status} collection={LOANS_COLLECTION} />
        ),
      },
      {
        raw: contact.name,
        label: <CollectionIconLink relatedDoc={contact} />,
      },
      {
        raw: feedback,
        label: feedback ? (
          <DialogSimple closeOnly label="Feedback">
            <h4>
              Envoyé le
              {moment(feedback.date).format('D MMM YYYY')}
            </h4>
            <HtmlPreview value={feedback.message} />
          </DialogSimple>
        ) : (
          'Pas encore de feedback'
        ),
      },
      {
        raw: '',
        label: <OfferDocuments offer={offer} />,
      },
    ],
    handleClick: () => setOfferDialog(offer),
  };
};

export default compose(
  withState('offerDialog', 'setOfferDialog', null),
  withProps(({ offers = [], setOfferDialog }) => ({
    rows: offers.map(makeMapOffer({ setOfferDialog })),
    columnOptions,
  })),
);
