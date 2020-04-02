import React from 'react';
import omit from 'lodash/omit';

import { borrowerUpdate, offerUpdate, propertyUpdate } from 'core/api';
import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import BorrowerSchema from 'core/api/borrowers/schemas/BorrowerSchema';
import { loanUpdate } from 'core/api/loans/index';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import { OFFERS_COLLECTION } from 'core/api/offers/offerConstants';
import { OfferSchema } from 'core/api/offers/offers';
import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import PropertySchema from 'core/api/properties/schemas/PropertySchema';
import Tabs from 'core/components/Tabs';

import SingleDevTab from './SingleDevTab';

const DevTab = ({ loan }) => {
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
                  .then(() => {
                    import('../../../../../core/utils/message').then(
                      ({ default: message }) => {
                        message('Done', 2);
                      },
                    );
                  })
              }
              collection={LOANS_COLLECTION}
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
                  .then(() => {
                    import('../../../../../core/utils/message').then(
                      ({ default: message }) => {
                        message('Done', 2);
                      },
                    );
                  })
              }
              collection={PROPERTIES_COLLECTION}
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
                  .then(() => {
                    import('../../../../../core/utils/message').then(
                      ({ default: message }) => {
                        message('Done', 2);
                      },
                    );
                  })
              }
              collection={BORROWERS_COLLECTION}
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
                  .then(() => {
                    import('../../../../../core/utils/message').then(
                      ({ default: message }) => {
                        message('Done', 2);
                      },
                    );
                  })
              }
              collection={OFFERS_COLLECTION}
            />
          ),
        })),
      ]}
    />
  );
};

export default DevTab;
