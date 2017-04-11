import React, { PropTypes } from 'react';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

const round = v => Math.round(v * 10000) / 100;

const OffersTable = props => {
  const offers = props.offers.map(
    o => props.showSpecial ? o.conditionsOffer : o.standardOffer,
  );
  return (
    <table className="minimal-table">
      <colgroup>
        <col span="1" style={{ width: '5%' }} />
        <col span="1" style={{ width: '20%' }} />
        <col span="1" style={{ width: '12%' }} />
        <col span="1" style={{ width: '12%' }} />
        <col span="1" style={{ width: '12%' }} />
        <col span="1" style={{ width: '12%' }} />
        <col span="1" style={{ width: '12%' }} />
        <col span="1" style={{ width: '15%' }} />
      </colgroup>
      <thead>
        <tr>
          <th className="left-align" />
          <th className="right-align">Montant</th>
          <th className="right-align">Taux Libor</th>
          <th className="right-align">Taux 2 ans</th>
          <th className="right-align">Taux 5 ans</th>
          <th className="right-align">Taux 10 ans</th>
          <th className="right-align">Amortissement</th>
          <th className="right-align">Expertise requise?</th>
        </tr>
      </thead>
      <tbody>
        {offers &&
          offers.map(
            (offer, index) =>
              offer &&
              <tr key={index}>
                <td className="left-align">{index + 1}</td>
                <td className="right-align">
                  CHF {toMoney(Math.round(offer.maxAmount))}
                </td>
                <td className="right-align">
                  {round(offer.interestLibor)}%
                </td>
                <td className="right-align">{round(offer.interest2)}%</td>
                <td className="right-align">{round(offer.interest5)}%</td>
                <td className="right-align">{round(offer.interest10)}%</td>
                <td className="right-align">{round(offer.amortizing)}%</td>
                <td className="right-align">
                  {offer.expertiseRequired ? 'Oui' : 'Non'}
                </td>
              </tr>,
          )}
      </tbody>
    </table>
  );
};

OffersTable.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object),
};

OffersTable.defaultProps = {
  offers: [],
};

export default OffersTable;
