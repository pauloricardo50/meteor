import React, { Component, PropTypes } from 'react';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

import RaisedButton from 'material-ui/RaisedButton';

const round = v => Math.round(v * 10000) / 100;

export default class OffersTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showFullTable: false,
    };

    this.handleToggleTable = this.handleToggleTable.bind(this);
  }

  handleToggleTable() {
    this.setState(prevState => ({
      showFullTable: !prevState.showFullTable,
    }));
  }

  render() {
    let offers = [
      ...this.props.offers.map(
        o => this.props.showSpecial ? o.conditionsOffer : o.standardOffer,
      ),
    ];
    offers.sort((a, b) => a.interest10 - b.interest10);
    offers = this.state.showFullTable ? offers : offers.slice(0, 5);
    return (
      <article>
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
