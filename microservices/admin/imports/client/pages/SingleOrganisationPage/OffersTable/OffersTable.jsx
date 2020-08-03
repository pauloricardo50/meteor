import React from 'react';

import { LENDERS_COLLECTION } from 'core/api/lenders/lenderConstants';
import { OFFERS_COLLECTION } from 'core/api/offers/offerConstants';
import DataTable from 'core/components/DataTable';
import DialogSimple from 'core/components/DialogSimple';
import HtmlPreview from 'core/components/HtmlPreview';
import { CollectionIconLink } from 'core/components/IconLink';
import OfferDocuments from 'core/components/OfferList/OfferDocuments';
import StatusLabel from 'core/components/StatusLabel';
import { IntlDate } from 'core/components/Translation';

const OffersTable = ({ organisationId }) => (
  <DataTable
    queryConfig={{
      query: OFFERS_COLLECTION,
      params: {
        $filters: { 'lenderCache.organisationLink._id': organisationId },
        createdAt: 1,
        lender: {
          loan: {
            name: 1,
            status: 1,
            user: { name: 1 },
            borrowers: { name: 1 },
          },
          status: 1,
          contact: { name: 1 },
        },
        feedback: 1,
        documents: 1,
      },
    }}
    initialSort={{ id: 'createdAt' }}
    columns={[
      {
        Header: 'Dossier',
        accessor: 'lender.loan',
        Cell: ({ value }) => <CollectionIconLink relatedDoc={value} />,
        disableSortBy: true,
      },
      {
        Header: 'Statut',
        accessor: 'lender.status',
        Cell: ({ value }) => (
          <StatusLabel status={value} collection={LENDERS_COLLECTION} />
        ),
      },
      {
        Header: 'Créé',
        accessor: 'createdAt',
        Cell: ({ value }) => (
          <IntlDate value={value} type="relative" style="long" />
        ),
      },
      {
        Header: 'Contact',
        accessor: 'lender.contact',
        Cell: ({ value }) => <CollectionIconLink relatedDoc={value} />,
        disableSortBy: true,
      },
      {
        Header: 'Feedback',
        accessor: 'feedback',
        Cell: ({ value }) =>
          value ? (
            <DialogSimple closeOnly label="Feedback">
              <h4>
                Envoyé&nbsp;
                <IntlDate value={value.date} type="relative" style="long" />
              </h4>
              <HtmlPreview value={value.message} />
            </DialogSimple>
          ) : (
            <span>Pas encore de feedback</span>
          ),
      },
      {
        Header: 'Documents',
        accessor: 'documents',
        Cell: ({ row: { original } }) => <OfferDocuments offer={original} />,
      },
    ]}
  />
);

export default OffersTable;
