import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import { getBorrowerFinanceArray } from 'core/arrays/BorrowerFormArray';
import AutoForm from 'core/components/AutoForm';
import MortgageNotesForm from 'core/components/MortgageNotesForm';
import Recap from 'core/components/Recap';
import T from 'core/components/Translation';
import VerticalAligner from 'core/components/VerticalAligner';
import * as financeConstants from 'core/config/financeConstants';
import { withCalculator } from 'core/containers/withCalculator';
import withMatchParam from 'core/containers/withMatchParam';

const BorrowerFinancePage = props => {
  const {
    loan: { userFormsEnabled, borrowers },
    Calculator,
  } = props;

  return (
    <section className="borrower-finance-page animated fadeIn flex-justify--center">
      <div className="borrower-finance__wrapper flex--helper flex-justify--center">
        {borrowers.map((borrower, index) => {
          const { _id: borrowerId, mortgageNotes } = borrower;
          return (
            <div className="borrower-finance__item col--50" key={borrowerId}>
              <div className="flex--helper flex--column flex--center m--20">
                <h3>
                  <T
                    id="Finance.recapTitle"
                    values={{ currency: financeConstants.CURRENCY }}
                  />
                </h3>
              </div>

              <VerticalAligner
                id="borrower-finance"
                defaultMargin={16}
                nb={index}
              >
                <Recap
                  arrayName="borrower"
                  borrower={borrower}
                  Calculator={Calculator}
                />

                <AutoForm
                  formClasses="user-form user-form__finance"
                  inputs={getBorrowerFinanceArray({ borrowers, borrowerId })}
                  borrowers={borrowers}
                  docId={borrowerId}
                  collection={BORROWERS_COLLECTION}
                  doc={borrower}
                  disabled={!userFormsEnabled}
                />

                <MortgageNotesForm
                  borrowerId={borrowerId}
                  mortgageNotes={mortgageNotes}
                  disabled={!userFormsEnabled}
                />
              </VerticalAligner>
            </div>
          );
        })}
      </div>
    </section>
  );
};

BorrowerFinancePage.propTypes = {
  borrowerId: PropTypes.string.isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default compose(
  withMatchParam('borrowerId'),
  withCalculator,
)(BorrowerFinancePage);
