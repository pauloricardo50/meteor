import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';

import AutoForm from 'core/components/AutoForm';
import MortgageNotesForm from 'core/components/MortgageNotesForm';
import { getBorrowerFinanceArray } from 'core/arrays/BorrowerFormArray';
import Recap from 'core/components/Recap';
import * as financeConstants from 'core/config/financeConstants';
import T from 'core/components/Translation';
import { BORROWERS_COLLECTION } from 'core/api/constants';
import withMatchParam from 'core/containers/withMatchParam';
import { withCalculator } from 'core/containers/withCalculator';

const BorrowerFinancePage = (props) => {
  const {
    loan: { userFormsEnabled, borrowers },
    Calculator,
  } = props;

  return (
    <section className="borrower-finance-page animated fadeIn flex-justify--center">
      <div className="borrower-finance__wrapper flex--helper flex-justify--center">
        {borrowers.map((borrower) => {
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

              <Recap
                arrayName="borrower"
                borrower={borrower}
                Calculator={Calculator}
              />

              <AutoForm
                formClasses="user-form user-form__info user-form__finance"
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
