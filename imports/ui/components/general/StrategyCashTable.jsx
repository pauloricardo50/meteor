import React, { Component, PropTypes } from 'react';

import TextInput from '../forms/TextInput.jsx';

import { toMoney } from '/imports/js/conversionFunctions';

const styles = {
  textField: {
    fontSize: 'inherit',
    // width: 185,
  },
  textFieldInput: {
    textAlign: 'right',
  },
};

export default class StrategyCashTable extends Component {
  constructor(props) {
    super(props);

    this.getListItems = this.getListItems.bind(this);
  }

  getListItems() {
    const r = this.props.loanRequest;
    const insuranceUseTax = 0.1; // TODO Impot sur le retrait du 2e pilier, à modifier
    const fees = 0.05;
    const subTotal = r.general.fortuneUsed +
      (r.property.value * fees) +
      (r.general.insuranceFortuneUsed * insuranceUseTax);

    return [
      {
        title: 'Fonds propres - Cash',
        className: 'secondary',
        className2: 'active',
        value:
          <TextInput
            id={'general.fortuneUsed'}
            currentValue={r.general.fortuneUsed}
            requestId={r._id}
            label=""
            placeholder="CHF"
            money
            style={styles.textField}
            inputStyle={styles.textFieldInput}
          />,
      }, {
        title: 'Frais de notaire',
        className: 'secondary',
        value: `~CHF ${toMoney(r.property.value * fees)}`,
      }, {
        title: 'Frais retrait LPP',
        className: 'secondary',
        value: `~CHF ${toMoney(r.general.insuranceFortuneUsed * insuranceUseTax)}`,
        hide: r.general.insuranceFortuneUsed <= 0,
      }, {
        title: 'Sous-total - Cash requis',
        className: 'bold',
        className2: 'bold',
        value: `CHF ${toMoney(subTotal)}`,
      }, {
        title: 'Fonds propres - LPP',
        className: 'secondary',
        className2: 'active',
        value:
          <TextInput
            id={'general.insuranceFortuneUsed'}
            currentValue={r.general.insuranceFortuneUsed}
            requestId={r._id}
            label=""
            placeholder="CHF"
            money
            style={styles.textField}
            inputStyle={styles.textFieldInput}
          />,
      }, {
        title: 'Total',
        className: 'bold',
        className2: 'bold',
        value: `CHF ${toMoney(subTotal + r.general.insuranceFortuneUsed)}`,
      },
    ];
  }

  render() {
    return (
      <article className="strategyCashTable">
        <ul className="table">
          {this.getListItems().map((item, i) => {
            if (!item.hide) {
              return (
                <li key={i} className={item.className === 'bold' && 'total'}>
                  <h3>
                    <span className={item.className}>{item.title}</span>
                    <span className={item.className2}>{item.value}</span>
                  </h3>
                </li>
              )
            }
          })}
        </ul>
      </article>
    );
  }
}

StrategyCashTable.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
