import { Meteor } from 'meteor/meteor';

import React from 'react';

import { STEPS } from 'core/api/constants';
import { setLoanStep } from 'core/api/loans/index';
import T from '../../../Translation';
import ConfirmMethod from '../../../ConfirmMethod';
import FinancingSection from '../FinancingSection';
import FinancingOffersHeader from './FinancingOffersHeader';
import OfferPicker from './OfferPicker';
import FinancingOffersSorter from './FinancingOffersSorter';
import FinancingOffersContainer from './FinancingOffersContainer';

const FinancingOffers = ({ loan }) => {
  const { offers = [] } = loan;

  return (
    <>
      {Meteor.microservice === 'admin' && (
        <span>
          Offres{' '}
          {loan.enableOffers ? (
            <span className="success">Activées</span>
          ) : (
            <>
              <span className="error">Désactivées</span>
              &nbsp;
              <span>
                <ConfirmMethod
                  size="small"
                  description={
                    <span>
                      Passera l'étape du dossier à "
                      <T id="Forms.step.OFFERS" />" et envoie un mail au client
                      pour l'inviter à consulter ses offres
                    </span>
                  }
                  buttonProps={{
                    label: 'Activer',
                    size: 'small',
                    raised: true,
                    secondary: offers.length > 0,
                  }}
                  method={() =>
                    setLoanStep.run({
                      loanId: loan._id,
                      nextStep: STEPS.OFFERS,
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
        className="financing-offers"
        sectionItemProps={{ className: 'financing-offers-structure' }}
      />
    </>
  );
};

export default FinancingOffersContainer(FinancingOffers);
