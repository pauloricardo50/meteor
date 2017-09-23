import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from '/imports/ui/components/general/Material/Checkbox';

import AutoForm from '/imports/ui/components/general/AutoForm';
import { getBorrowerFinanceArray } from '/imports/js/arrays/BorrowerFormArray';
import cleanMethod from '/imports/api/cleanMethods';
import Recap from '/imports/ui/components/general/Recap';
import constants from '/imports/js/config/constants';
import LoadingButton from '/imports/ui/components/general/LoadingButton';
import { T } from '/imports/ui/components/general/Translation';
import { disableForms } from '/imports/js/helpers/requestFunctions';
import track from '/imports/js/helpers/analytics';

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

const handleCheck = (event, isInputChecked, id) => {
  // Save data to DB
  const object = {};
  object['logic.financeEthics'] = isInputChecked;

  cleanMethod('updateBorrower', object, id);
};

const handleClick = (event, id, props) => {
  // Save data to DB
  const object = {};
  object['logic.hasValidatedFinances'] = true;

  cleanMethod('updateBorrower', object, id).then(() =>
    track('validated finances', {}),
  );
};

const BorrowerFinancePage = (props) => {
  const borrowerId = props.match.params.borrowerId;
  const borrower = props.borrowers.find(b => b._id === borrowerId);
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
            values={{ currency: constants.getCurrency() }}
          />
        </h3>
        <Recap arrayName="borrower" borrower={borrower} />
      </div>

      <div className="conditions mask2 primary-border">
        <span>
          <Checkbox
            checked={borrower.logic.financeEthics}
            label="Les informations entrées ci-dessous sont exhaustives et correctes"
            style={styles.checkbox}
            onCheck={(e, isChecked) => handleCheck(e, isChecked, borrowerId)}
            disabled={borrower.logic.hasValidatedFinances}
          />
        </span>
        <LoadingButton
          label="Valider mes finances"
          handleClick={e => handleClick(e, borrowerId, props)}
          disabled={!borrower.logic.financeEthics}
          value={borrower.logic.hasValidatedFinances}
        />
      </div>

      <div className="description">
        <p>
          <T id="Forms.mandatory" />
        </p>
      </div>

      <AutoForm
        inputs={getBorrowerFinanceArray(props.borrowers, borrowerId)}
        borrowers={props.borrowers}
        documentId={borrowerId}
        updateFunc="updateBorrower"
        pushFunc="pushBorrowerValue"
        popFunc="popBorrowerValue"
        doc={borrower}
        disabled={disableForms(props.loanRequest)}
      />
    </section>
  );
};

BorrowerFinancePage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BorrowerFinancePage;
