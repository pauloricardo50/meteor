import React, { Component, PropTypes } from 'react';


export default class LenderOffersTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table className="minimal-table">
        <colgroup>
          <col span="1" style={{ width: '21%' }} />
          <col span="1" style={{ width: '21%' }} />
          <col span="1" style={{ width: '21%' }} />
          <col span="1" style={{ width: '21%' }} />
          <col span="1" style={{ width: '16%' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="left-align">Prêteur</th>
            <th className="right-align">Montant</th>
            <th className="right-align">Taux D'intérêt</th>
            <th className="right-align">Amortissement</th>
            <th className="left-align">Expertise Requise?</th>
          </tr>
        </thead>
        <tbody>
          {this.props.lenderOffers.map((lenderOffer, index) => (
            <tr key={index}>
              <td className="left-align">{lenderOffer.lender}</td>
              <td className="right-align">{lenderOffer.maxAmount}</td>
              <td className="right-align">{lenderOffer.interest10}</td>
              <td className="right-align">{lenderOffer.amortizing}</td>
              <td className="left-align">{lenderOffer.expertise.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

LenderOffersTable.propTypes = {
  lenderOffers: PropTypes.arrayOf(PropTypes.object),
};
