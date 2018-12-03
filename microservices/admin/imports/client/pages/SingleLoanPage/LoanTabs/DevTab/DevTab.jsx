// @flow
import React from 'react';
import AutoForm from 'core/components/AutoForm2';
import omit from 'lodash/omit';

import Tabs from 'core/components/Tabs';
import message from 'core/utils/message';
import LoanSchema from 'core/api/loans/schemas/LoanSchema';
import { loanUpdate } from 'core/api/loans/index';
import { BorrowerSchema } from 'core/api/borrowers/borrowers';
import { PropertySchema } from 'core/api/properties/properties';
import { OfferSchema } from 'core/api/offers/offers';
import { propertyUpdate, borrowerUpdate, offerUpdate } from 'core/api';

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
            <AutoForm
              schema={LoanSchema}
              model={loan}
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
            <AutoForm
              schema={PropertySchema}
              model={property}
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
            <AutoForm
              schema={BorrowerSchema}
              model={borrower}
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
            <AutoForm
              schema={OfferSchema}
              model={offer}
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
