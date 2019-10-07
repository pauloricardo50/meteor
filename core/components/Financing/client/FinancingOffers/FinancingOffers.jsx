// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { STEPS } from 'core/api/constants';
import { loanUpdate } from 'core/api/loans/index';
import T from '../../../Translation';
import ConfirmMethod from '../../../ConfirmMethod';
import FinancingSection from '../FinancingSection';
import FinancingOffersHeader from './FinancingOffersHeader';
import OfferPicker from './OfferPicker';
import FinancingOffersSorter from './FinancingOffersSorter';
import FinancingOffersContainer from './FinancingOffersContainer';

type FinancingOffersProps = {};

const FinancingOffers = ({ loan }: FinancingOffersProps) => (
  <>
    {Meteor.microservice === 'admin' && (
      <span>
        Offres
        {' '}
        {loan.enableOffers ? (
          <span className="success">Activées</span>
        ) : (
          <>
            <span className="error">Désactivées</span>
            &nbsp;
            <span>
              <ConfirmMethod
                size="small"
                description={(
                  <span>
                    Passera l'étape du dossier à "
                    <T id="Forms.step.OFFERS" />
"
                  </span>
                )}
                buttonProps={{ label: 'Activer', size: 'small' }}
                method={() =>
                  loanUpdate.run({
                    loanId: loan._id,
                    object: { step: STEPS.OFFERS },
                  })
                }
              />
            </span>
          </>
        )}
      </span>
    )}
    <FinancingSection
      summaryConfig={[
        {
          id: 'offer',
          label: (
            <span className="section-title">
              <T id="FinancingOffers.title" />
            </span>
          ),
          Component: FinancingOffersHeader,
        },
      ]}
      detailConfig={[
        {
          id: 'offerId',
          label: <FinancingOffersSorter />,
          Component: OfferPicker,
        },
      ]}
      noWrapper
      className="financing-offers"
    />
  </>
);

export default FinancingOffersContainer(FinancingOffers);
