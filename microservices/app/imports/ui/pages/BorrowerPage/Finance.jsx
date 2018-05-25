import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from 'core/components/Checkbox';

import AutoForm from 'core/components/AutoForm';
import { getBorrowerFinanceArray } from 'core/arrays/BorrowerFormArray';
import Recap from 'core/components/Recap';
import * as financeConstants from 'core/config/financeConstants';
import LoadingButton from '/imports/ui/components/LoadingButton';
import T from 'core/components/Translation';
import { disableForms } from 'core/utils/loanFunctions';
import track from 'core/utils/analytics';
import { borrowerUpdate } from 'core/api';

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
    .run({ object, borrowerId: id })
    .then(() => track('validated finances', {}));
};

const BorrowerFinancePage = (props) => {
  const {
    match: {
      params: { borrowerId },
    },
    borrowers,
    loan,
  } = props;
  const borrower = borrowers.find(b => b._id === borrowerId);
  return (
    <section className="borrower-finance-page animated fadeIn" key={borrowerId}>
      <hr />
      <h2 className="text-center">
        <T id="Finance.title" />
      </h2>

      <div className="description">
        <p>
          <T id="Finance.description" />
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 20px',
        }}
      >
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
        inputs={getBorrowerFinanceArray({ ...props, borrowerId })}
        borrowers={borrowers}
        docId={borrowerId}
        collection="borrowers"
        doc={borrower}
        disabled={disableForms({ loan }) || borrower.logic.hasValidatedFinances}
      />

      <div className="conditions mask2 primary-border">
        <span>
          <Checkbox
            id="hasValidatedFinances"
            value={borrower.logic.financeEthics}
            label="Les informations entrées ci-dessus sont exhaustives et correctes"
            style={styles.checkbox}
            onChange={(_, isChecked) => handleCheck(_, isChecked, borrowerId)}
            disabled={borrower.logic.hasValidatedFinances}
          />
        </span>
        <LoadingButton
          label="Valider mes finances"
          handleClick={e => handleClick(e, borrowerId)}
          disabled={!borrower.logic.financeEthics}
          value={borrower.logic.hasValidatedFinances}
        />
      </div>
    </section>
  );
};

BorrowerFinancePage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
};

export default BorrowerFinancePage;
