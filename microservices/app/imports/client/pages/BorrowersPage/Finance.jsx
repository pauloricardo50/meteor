import PropTypes from 'prop-types';
import React from 'react';

import AutoForm from 'core/components/AutoForm';
import { getBorrowerFinanceArray } from 'core/arrays/BorrowerFormArray';
import Recap from 'core/components/Recap';
import * as financeConstants from 'core/config/financeConstants';
import T from 'core/components/Translation';
import { BORROWERS_COLLECTION } from 'core/api/constants';
import withMatchParam from 'core/containers/withMatchParam';

const BorrowerFinancePage = (props) => {
  const {
    loan: { userFormsEnabled, borrowers },
  } = props;

  return (
    <section className="borrower-finance-page animated fadeIn flex-justify--center">
      <h2 className="text-center">
        <T id="Finance.title" />
      </h2>

      <div className="description">
        <p>
          <T id="Finance.description" />
        </p>
      </div>

      <div className="borrower-finance__wrapper flex--helper flex-justify--center">
        {borrowers.map(borrower => (
          <div className="borrower-finance__item col--50" key={borrower._id}>
            <div className="flex--helper flex--column flex--center m--20">
              <h3>
                <T
                  id="Finance.recapTitle"
                  values={{ currency: financeConstants.CURRENCY }}
                />
              </h3>
              <Recap arrayName="borrower" borrower={borrower} />
            </div>

            <div className="description">
              <p>
                <T id="Forms.mandatory" />
              </p>
            </div>

            <AutoForm
              formClasses="user-form user-form__finance"
              inputs={getBorrowerFinanceArray({
                borrowers,
                borrowerId: borrower._id,
              })}
              borrowers={borrowers}
              docId={borrower._id}
              collection={BORROWERS_COLLECTION}
              doc={borrower}
              disabled={!userFormsEnabled}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

BorrowerFinancePage.propTypes = {
  borrowerId: PropTypes.string.isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withMatchParam('borrowerId')(BorrowerFinancePage);
