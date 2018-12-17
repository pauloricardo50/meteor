// @flow
import React from 'react';
import omit from 'lodash/omit';

import Tabs from 'core/components/Tabs';
import message from 'core/utils/message';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import { loanUpdate } from 'core/api/loans/index';
import BorrowerSchema from 'core/api/borrowers/schemas/BorrowerSchema';
import PropertySchema from 'core/api/properties/schemas/PropertySchema';
import { OfferSchema } from 'core/api/offers/offers';
import { propertyUpdate, borrowerUpdate, offerUpdate } from 'core/api';
import SingleDevTab from './SingleDevTab';

type DevTabProps = {};

const DevTab = ({ loan }: DevTabProps) => {
  const { properties = [], borrowers = [], offers = [] } = loan;

  return (
    <Tabs
      tabs={[
        {
          id: 'loan',
          label: 'Hypothèque',
          content: (
            <SingleDevTab
              schema={LoanSchema}
              doc={loan}
              onSubmit={doc =>
                loanUpdate
                  .run({
                    loanId: loan._id,
                    object: omit(doc, [
                      'borrowers',
                      'properties',
                      'structure',
                      'offers',
                      'user',
                      'documents',
                    ]),
                  })
                  .then(() => message('Done', 2))
              }
            />
          ),
        },
        ...properties.map((property, index) => ({
          id: property._id,
          label: property.address1 || `Bien immo ${index + 1}`,
          content: (
            <SingleDevTab
              schema={PropertySchema}
              doc={property}
              onSubmit={doc =>
                propertyUpdate
                  .run({
                    propertyId: property._id,
                    object: omit(doc, ['loans', 'user', 'documents']),
                  })
                  .then(() => message('Done', 2))
              }
            />
          ),
        })),
        ...borrowers.map((borrower, index) => ({
          id: borrower._id,
          label: borrower.name || `Emprunteur ${index + 1}`,
          content: (
            <SingleDevTab
              schema={BorrowerSchema}
              doc={borrower}
              onSubmit={doc =>
                borrowerUpdate
                  .run({
                    borrowerId: borrower._id,
                    object: omit(doc, ['loans', 'user', 'documents']),
                  })
                  .then(() => message('Done', 2))
              }
            />
          ),
        })),
        ...offers.map((offer, index) => ({
          id: offer._id,
          label: `Offre: ${offer.organisation.name}` || `Offre ${index + 1}`,
          content: (
            <SingleDevTab
              schema={OfferSchema}
              doc={offer}
              onSubmit={doc =>
                offerUpdate
                  .run({
                    offerId: offer._id,
                    object: omit(doc, ['loan', 'user', 'documents']),
                  })
                  .then(() => message('Done', 2))
              }
            />
          ),
        })),
      ]}
    />
  );
};

export default DevTab;
