import React, { Component, PropTypes } from 'react';

import { toMoney } from '/imports/js/finance-math';


const styles = {
  table: {
    width: '100%',
    minWidth: 320,
    maxWidth: 600,
  },
};

export default class PartnerOffersTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table className="minimal-table" style={styles.table}>
        <colgroup>
          <col span="1" style={{ width: '5%' }} />
          <col span="1" style={{ width: '30%' }} />
          <col span="1" style={{ width: '20%' }} />
          <col span="1" style={{ width: '20%' }} />
          <col span="1" style={{ width: '25%' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="left-align"></th>
            <th className="right-align">Montant</th>
            <th className="right-align">Taux D&apos;intérêt</th>
            <th className="right-align">Amortissement</th>
            <th className="right-align">Expertise Requise?</th>
          </tr>
        </thead>
        <tbody>
          {this.props.partnerOffers.map((partnerOffer, index) => (
            partnerOffer.standardOffer &&
              <tr key={index}>
                <td className="left-align">{index + 1}</td>
                <td className="right-align">CHF {toMoney(partnerOffer.standardOffer.maxAmount)}</td>
                <td className="right-align">{partnerOffer.standardOffer.interest10}%</td>
                <td className="right-align">{partnerOffer.standardOffer.amortizing}%</td>
                <td className="right-align">{partnerOffer.expertiseRequired ? 'Oui' : 'Non'}</td>
              </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

PartnerOffersTable.propTypes = {
  partnerOffers: PropTypes.arrayOf(PropTypes.object),
};
