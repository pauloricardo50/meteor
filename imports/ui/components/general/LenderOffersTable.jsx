import React, { Component, PropTypes } from 'react';


export default class LenderOffersTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table className="lender-offers-table">
        <colgroup>
          <col span="1" style={{ width: '21%' }} />
          <col span="1" style={{ width: '21%' }} />
          <col span="1" style={{ width: '21%' }} />
          <col span="1" style={{ width: '21%' }} />
          <col span="1" style={{ width: '16%' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="left">Prêteur</th>
            <th className="right">Montant</th>
            <th className="right">Taux D'intérêt</th>
            <th className="right">Amortissement</th>
            <th className="left">Expertise Requise?</th>
          </tr>
        </thead>
        <tbody>
          {this.props.lenderOffers.map((lenderOffer, index) => (
            <tr>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
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
