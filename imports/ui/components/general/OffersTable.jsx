import React, { PropTypes } from 'react';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

const styles = {
  table: {
    width: '100%',
    minWidth: 320,
    maxWidth: 600,
  },
};

const OffersTable = props => (
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
        <th className="left-align" />
        <th className="right-align">Montant</th>
        <th className="right-align">Taux d'intérêt</th>
        <th className="right-align">Amortissement</th>
        <th className="right-align">Expertise requise?</th>
      </tr>
    </thead>
    <tbody>
      {props.offers &&
        props.offers.map(
          (offer, index) => offer.standardOffer &&
          <tr key={index}>
            <td className="left-align">{index + 1}</td>
            <td className="right-align">
              CHF {toMoney(Math.round(offer.standardOffer.maxAmount))}
            </td>
            <td className="right-align">{offer.standardOffer.interest10}%</td>
            <td className="right-align">{offer.standardOffer.amortizing}%</td>
            <td className="right-align">
              {offer.expertiseRequired ? 'Oui' : 'Non'}
            </td>
          </tr>,
        )}
    </tbody>
  </table>
);

OffersTable.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object),
};

OffersTable.defaultProps = {
  offers: [],
};

export default OffersTable;
