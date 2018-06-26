import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from 'core/components/Checkbox';

import AutoForm from 'core/components/AutoForm';
import { getBorrowerFinanceArray } from 'core/arrays/BorrowerFormArray';
import Recap from 'core/components/Recap';
import * as financeConstants from 'core/config/financeConstants';
import T from 'core/components/Translation';
import track from 'core/utils/analytics';
import { borrowerUpdate } from 'core/api';
import { BORROWERS_COLLECTION } from 'core/api/constants';
import withMatchParam from 'core/containers/withMatchParam';
import LoadingButton from '../../components/LoadingButton';

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
  },
  topButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  bottomButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  checkbox: {
    textAlign: 'unset',
  },
};

const handleCheck = (_, isInputChecked, id) => {
  const object = { 'logic.financeEthics': isInputChecked };
  borrowerUpdate.run({ object, borrowerId: id });
};

const handleClick = (event, id) => {
  const object = { 'logic.hasValidatedFinances': true };
  borrowerUpdate
    .run({ object, id })
    .then(() => track('validated finances', {}));
};

const BorrowerFinancePage = (props) => {
  const {
    borrowerId,
    loan: { userFormsEnabled, borrowers },
  } = props;
  const borrowerLogic = borrowers.find(b => b._id === borrowerId);

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

      <div className="conditions mask2 primary-border">
        <span>
          <Checkbox
            id="hasValidatedFinances"
            value={borrowerLogic.logic.financeEthics}
            label="Les informations entrées ci-dessus sont exhaustives et correctes"
            style={styles.checkbox}
            onChange={(_, isChecked) => handleCheck(_, isChecked, borrowerId)}
            disabled={borrowerLogic.logic.hasValidatedFinances}
          />
        </span>
        <LoadingButton
          label="Valider mes finances"
          handleClick={e => handleClick(e, borrowerId)}
          disabled={!borrowerLogic.logic.financeEthics}
          value={borrowerLogic.logic.hasValidatedFinances}
        />
      </div>
    </section>
  );
};

BorrowerFinancePage.propTypes = {
  borrowerId: PropTypes.string.isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withMatchParam('borrowerId')(BorrowerFinancePage);
