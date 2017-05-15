import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from 'material-ui/Checkbox';

import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';
import { getBorrowerFinanceArray } from '/imports/js/arrays/BorrowerFormArray';
import cleanMethod from '/imports/api/cleanMethods';
import Recap from '/imports/ui/components/general/Recap';
import constants from '/imports/js/config/constants';
import LoadingButton from '/imports/ui/components/general/LoadingButton.jsx';

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

  cleanMethod('updateBorrower', object, id);
};

const BorrowerFinancePage = props => {
  const borrowerId = props.match.params.borrowerId;
  const borrower = props.borrowers.find(b => b._id === borrowerId);
  return (
    <section className="borrower-finance-page animated fadeIn" key={borrowerId}>
      <hr />
      <h2 className="text-center">
        Mes Finances
        <br />
        {borrower.logic.hasValidatedFinances &&
          <small className="success">Validées <span className="fa fa-check" /></small>}
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 20px',
        }}
      >
        <h3>Récapitulatif (en {constants.getCurrency()})</h3>
        <Recap arrayName="borrower" borrower={borrower} />
      </div>

      <div className="description">
        <p>Les champs marqués avec un * sont obligatoires.</p>
      </div>

      <AutoForm
        inputs={getBorrowerFinanceArray(props.borrowers, borrowerId)}
        borrowers={props.borrowers}
        documentId={borrowerId}
        updateFunc="updateBorrower"
        pushFunc="pushBorrowerValue"
        popFunc="popBorrowerValue"
        doc={borrower}
      />

      <div className="conditions">
        <span>
          <Checkbox
            checked={borrower.logic.financeEthics}
            label="Les informations entrées ci-dessus sont exhaustives et correctes"
            style={styles.checkbox}
            onCheck={(e, isChecked) => handleCheck(e, isChecked, borrowerId)}
          />
        </span>
        <LoadingButton
          label="Valider mes finances"
          handleClick={e => handleClick(e, borrowerId, props)}
          disabled={!borrower.logic.financeEthics}
          value={borrower.logic.hasValidatedFinances}
        />
      </div>
    </section>
  );
};

BorrowerFinancePage.propTypes = {
  // loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BorrowerFinancePage;
