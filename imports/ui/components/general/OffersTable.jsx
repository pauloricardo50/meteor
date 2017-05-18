import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

import RaisedButton from 'material-ui/RaisedButton';
import AutoTooltip from '/imports/ui/components/general/AutoTooltip.jsx';
import ConditionsButton from '/imports/ui/components/general/ConditionsButton.jsx';

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
    label: 'Conditions?',
    align: 'c',
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
      ...this.props.offers.map(
        o =>
          this.props.showSpecial
            ? {
              ...o.counterpartOffer,
              conditions: o.conditions,
              counterparts: o.counterparts,
            }
            : {
              ...o.standardOffer,
              conditions: o.conditions,
              counterparts: [],
            },
      ),
    ];
    offers.sort((a, b) => a.interest10 - b.interest10);
    if (this.props.showSpecial) {
      offers = offers.filter(o => o.counterparts.length > 0);
    }
    const shownOffers = this.state.showFullTable ? offers : offers.slice(0, 5);

    return (
      <article>
        <table className="minimal-table">
          {/* <colgroup>
            {columns.map(c => <col span="1" style={{ width: `${c.width}%` }} key={c.label} />)}
          </colgroup> */}
          <thead>
            <tr>
              {columns.map(c => (
                <th className={c.align} key={c.label}>
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
                    <td className="r">{round(offer.amortization)}%</td>
                    <td className="c">
                      {offer.conditions.length > 0 || offer.counterparts.length > 0
                        ? <ConditionsButton
                          conditions={offer.conditions}
                          counterparts={offer.counterparts}
                        />
                        : '-'}
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
  showSpecial: PropTypes.bool.isRequired,
};

OffersTable.defaultProps = {
  offers: [],
};
