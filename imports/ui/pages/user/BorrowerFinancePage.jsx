import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

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

  cleanMethod('updateBorrower', object, id, () =>
    Meteor.setTimeout(() => props.history.push('/app'), 300));
};

const BorrowerFinancePage = props => {
  const borrowerId = props.match.params.borrowerId;
  const borrower = props.borrowers.find(b => b._id === borrowerId);
  return (
    <div style={styles.div}>
      <RaisedButton
        label="Retour"
        containerElement={<Link to={'/app'} />}
        style={styles.topButton}
      />

      <section className="mask1 borrower-finance-page">
        <h1>
          {borrower.firstName || "Fiche d'Emprunteur"}
        </h1>

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
          <RaisedButton
            label="Valider mes finances"
            onTouchTap={e => handleClick(e, borrowerId, props)}
            primary={!borrower.logic.hasValidatedFinances}
            disabled={!borrower.logic.financeEthics}
            icon={!!borrower.logic.hasValidatedFinances && <CheckIcon />}
          />
        </div>
      </section>
    </div>
  );
};

BorrowerFinancePage.propTypes = {
  // loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default BorrowerFinancePage;
