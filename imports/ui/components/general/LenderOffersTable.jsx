import React, { Component, PropTypes } from 'react';

import { toMoney } from '/imports/js/finance-math';


const styles = {
  table: {
    maxWidth: 600,
  },
};

export default class LenderOffersTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table className="minimal-table" style={styles.table}>
        <colgroup>
          <col span="1" style={{ width: '15%' }} />
          <col span="1" style={{ width: '20%' }} />
          <col span="1" style={{ width: '20%' }} />
          <col span="1" style={{ width: '20%' }} />
          <col span="1" style={{ width: '25%' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="left-align">Prêteur</th>
            <th className="right-align">Montant</th>
            <th className="right-align">Taux D&apos;intérêt</th>
            <th className="right-align">Amortissement</th>
            <th className="left-align">Expertise Requise?</th>
          </tr>
        </thead>
        <tbody>
          {this.props.partnerOffers.map((lenderOffer, index) => (
            <tr key={index}>
              <td className="left-align">Prêteur {index + 1}</td>
              <td className="right-align">CHF {toMoney(lenderOffer.standardOffer.maxAmount)}</td>
              <td className="right-align">{lenderOffer.standardOffer.interest10}%</td>
              <td className="right-align">{lenderOffer.standardOffer.amortizing}%</td>
              <td className="left-align">{lenderOffer.expertiseRequired ? 'Oui' : 'Non'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

LenderOffersTable.propTypes = {
  partnerOffers: PropTypes.arrayOf(PropTypes.object),
};
