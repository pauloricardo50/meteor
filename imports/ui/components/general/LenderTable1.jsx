import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import { toMoney } from '/imports/js/finance-math.js';


const styles = {
};

export default class LenderTable1 extends React.Component {
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
          {this.props.lenderOffers && this.props.lenderOffers.map((offer, index) => (
            <tr>
              <td className="left-align">{index + 1}</td>
              <td className="left-align">{`CHF ${toMoney(offer.maxValue)}`}</td>
              <td className="right-align">{`CHF ${this.calculatePayment(offer)}`}</td>
              <td className="right-align">
                <RaisedButton
                  label="Choisir"
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

LenderTable1.propTypes = {
  creditRequest: React.PropTypes.objectOf(React.PropTypes.any),
  lenderOffers: React.PropTypes.objectOf(React.PropTypes.any),
};
