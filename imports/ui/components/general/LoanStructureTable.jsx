import React, { PropTypes } from 'react';

import TextInput from '../autoform/TextInput.jsx';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';

const styles = {
  textField: {
    fontSize: 'inherit',
    // width: 185,
  },
  textFieldInput: {
    textAlign: 'right',
  },
};

const getListItems = props => {
  const r = props.loanRequest;
  const subTotal = r.general.fortuneUsed +
    r.property.value * constants.notaryFees +
    r.general.insuranceFortuneUsed * constants.lppFees;

  return [
    {
      title: 'Fonds propres - Cash',
      className: 'secondary',
      className2: 'active',
      value: (
        <TextInput
          id={'general.fortuneUsed'}
          currentValue={r.general.fortuneUsed}
          requestId={r._id}
          label=""
          placeholder="CHF"
          money
          style={styles.textField}
          inputStyle={styles.textFieldInput}
        />
      ),
    },
    {
      title: 'Frais de notaire',
      className: 'secondary',
      value: `~CHF ${toMoney(r.property.value * constants.notaryFees)}`,
    },
    {
      title: 'Frais retrait LPP',
      className: 'secondary',
      value: `~CHF ${toMoney(r.general.insuranceFortuneUsed * constants.lppFees)}`,
      hide: r.general.insuranceFortuneUsed <= 0,
    },
    {
      title: 'Sous-total - Cash requis',
      className: 'bold',
      className2: 'bold',
      value: `CHF ${toMoney(subTotal)}`,
    },
    {
      title: 'Fonds propres - LPP',
      className: 'secondary',
      className2: 'active',
      value: (
        <TextInput
          id={'general.insuranceFortuneUsed'}
          currentValue={r.general.insuranceFortuneUsed}
          requestId={r._id}
          label=""
          placeholder="CHF"
          money
          style={styles.textField}
          inputStyle={styles.textFieldInput}
        />
      ),
    },
    {
      title: 'Total',
      className: 'bold',
      className2: 'bold',
      value: `CHF ${toMoney(subTotal + r.general.insuranceFortuneUsed)}`,
    },
  ];
};

const LoanStructureTable = props => (
  <article className="strategyCashTable">
    <ul className="table">
      {getListItems(props).map((item, i) => {
        if (!item.hide) {
          return (
            <li key={i} className={item.className === 'bold' && 'total'}>
              <h3>
                <span className={item.className}>{item.title}</span>
                <span className={item.className2}>{item.value}</span>
              </h3>
            </li>
          );
        }
      })}
    </ul>
  </article>
);

LoanStructureTable.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoanStructureTable;
