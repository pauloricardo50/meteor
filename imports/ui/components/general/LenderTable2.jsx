import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import { toMoney } from '/imports/js/finance-math.js';


export default class LenderTable2 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table className="minimal-table">
        <colgroup>
          <col span="1" style={{ width: '10%' }} />
          <col span="1" style={{ width: '30%' }} />
          <col span="1" style={{ width: '30%' }} />
          <col span="1" style={{ width: '30%' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="left-align" />
            <th className="right-align">Prêt Maximal</th>
            <th className="right-align">Paiement Mensuel</th>
            <th className="right-align" />
          </tr>
        </thead>
        <tbody>
          {this.props.partnerOffers && this.props.partnerOffers.map((offer, index) => (
            <tr>
              <td className="left-align">{index + 1}</td>
              <td className="left-align">{`CHF ${toMoney(offer.maxValue)}`}</td>
              <td className="right-align">{`CHF ${this.calculatePayment(offer)}`}</td>
              <td className="right-align">
                <RaisedButton
                  label="Condition"
                  primary
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

LenderTable2.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
  partnerOffers: React.PropTypes.objectOf(React.PropTypes.any),
};
