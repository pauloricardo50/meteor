import React, { PropTypes } from 'react';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

const round = v => Math.round(v * 10000) / 100;

const OffersTable = props => {
  let offers = [
    ...props.offers.map(
      o => props.showSpecial ? o.conditionsOffer : o.standardOffer,
    ),
  ];
  offers.sort((a, b) => a.interestLibor - b.interestLibor);
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
          <th className="l" />
          <th className="r">Montant</th>
          <th className="r">Taux Libor</th>
          <th className="r">Taux 2 ans</th>
          <th className="r">Taux 5 ans</th>
          <th className="r">Taux 10 ans</th>
          <th className="r">Amortissement</th>
          <th className="r">Expertise requise?</th>
        </tr>
      </thead>
      <tbody>
        {offers &&
          offers.map(
            (offer, index) =>
              offer &&
              <tr key={index}>
                <td className="l">{index + 1}</td>
                <td className="r">
                  CHF {toMoney(Math.round(offer.maxAmount))}
                </td>
                <td className="r">
                  {round(offer.interestLibor)}%
                </td>
                <td className="r">{round(offer.interest2)}%</td>
                <td className="r">{round(offer.interest5)}%</td>
                <td className="r">{round(offer.interest10)}%</td>
                <td className="r">{round(offer.amortizing)}%</td>
                <td className="r">
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
