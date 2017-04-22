import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

import RaisedButton from 'material-ui/RaisedButton';
import AutoTooltip from '/imports/ui/components/general/AutoTooltip.jsx';

const round = v => Math.round(v * 10000) / 100;

const columns = [
  {
    label: '',
    align: 'l',
    width: 5,
  },
  {
    label: 'Montant',
    align: 'r',
    width: 15,
  },
  {
    label: 'Taux Libor',
    align: 'r',
    width: 12,
  },
  {
    label: 'Taux 2 ans',
    align: 'r',
    width: 12,
  },
  {
    label: 'Taux 5 ans',
    align: 'r',
    width: 12,
  },
  {
    label: 'Taux 10 ans',
    align: 'r',
    width: 12,
  },
  {
    label: 'Amortissement',
    align: 'r',
    width: 10,
  },
  {
    label: 'Expertise?',
    align: 'r',
    width: 15,
  },
];

export default class OffersTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showFullTable: false,
    };
  }

  handleToggleTable = () => {
    this.setState(prevState => ({
      showFullTable: !prevState.showFullTable,
    }));
  };

  render() {
    let offers = [
      ...this.props.offers.map(o => (this.props.showSpecial ? o.conditionsOffer : o.standardOffer)),
    ];
    offers.sort((a, b) => a.interest10 - b.interest10);
    const shownOffers = this.state.showFullTable ? offers : offers.slice(0, 5);
    return (
      <article>
        <table className="minimal-table">
          <colgroup>
            {columns.map(c => <col span="1" style={{ width: `${c.width}%` }} />)}
          </colgroup>
          <thead>
            <tr>
              {columns.map(c => (
                <th className={c.align}>
                  <AutoTooltip list="table">{c.label}</AutoTooltip>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shownOffers &&
              shownOffers.map(
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

        {offers.length > 5 &&
          <div className="text-center" style={{ marginBottom: 20 }}>
            <RaisedButton
              label={this.state.showFullTable ? 'Masquer' : 'Afficher tout'}
              onTouchTap={this.handleToggleTable}
            />
          </div>}
      </article>
    );
  }
}

OffersTable.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object),
};

OffersTable.defaultProps = {
  offers: [],
};
