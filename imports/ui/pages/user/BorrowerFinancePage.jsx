import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import CheckIcon from 'material-ui/svg-icons/navigation/check';

import { Link } from 'react-router-dom';

import AutoForm from '/imports/ui/components/autoform/AutoForm.jsx';
import { getBorrowerFinanceArray } from '/imports/js/arrays/BorrowerFormArray';
import cleanMethod from '/imports/api/cleanMethods';

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
  },
  topButton: {
    marginBottom: 20,
    alignSelf: 'flex-end',
  },
  bottomButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
};

const handleCheck = (event, isInputChecked, id) => {
  // Save data to DB
  const object = {};
  object['logic.financeEthics'] = isInputChecked;

  cleanMethod('updateBorrower', object, id);
};

const handleClick = (event, id) => {
  // Save data to DB
  const object = {};
  object['logic.hasValidatedFinances'] = true;

  cleanMethod('updateBorrower', object, id);
};

const BorrowerFinancePage = props => {
  const borrowerId = props.match.params.borrowerId;
  const borrower = props.borrowers.find(b => b._id === borrowerId);
  return (
    <div style={styles.div}>
      <RaisedButton
        label="Ok"
        containerElement={<Link to={`/app/borrowers/${borrowerId}`} />}
        primary
        style={styles.topButton}
      />

      <section className="mask1 borrower-finance-page">
        <h1>
          {borrower.firstName || "Fiche d'Emprunteur"}
        </h1>

        <AutoForm
          inputs={getBorrowerFinanceArray(props, borrowerId)}
          formClasses="col-sm-10 col-sm-offset-1"
          // loanRequest={props.loanRequest}
          borrowers={props.borrowers}
          documentId={borrowerId}
          updateFunc="updateBorrower"
          pushFunc="pushBorrowerValue"
          popFunc="popBorrowerValue"
        />

        <div className="conditions">
          <Checkbox
            checked={borrower.logic.financeEthics}
            label="Les informations entrées ci-dessus sont exhaustives et correctes"
            style={styles.checkbox}
            onCheck={(e, isChecked) => handleCheck(e, isChecked, borrowerId)}
          />
          <RaisedButton
            label="Valider mes finances"
            onTouchTap={e => handleClick(e, borrowerId)}
            primary={!borrower.logic.hasValidatedFinances}
            disabled={!borrower.logic.financeEthics}
            icon={!!borrower.logic.hasValidatedFinances && <CheckIcon />}
          />
        </div>
      </section>

      <RaisedButton
        label="Ok"
        containerElement={<Link to={`/app/borrowers/${borrowerId}`} />}
        primary
        style={styles.bottomButton}
      />
    </div>
  );
};

BorrowerFinancePage.propTypes = {
  // loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BorrowerFinancePage;
