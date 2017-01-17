import React, { Component, PropTypes } from 'react';


import AuctionTableLine from '/imports/ui/components/partner/AuctionTableLine.jsx';

const styles = {
  article: {
    marginTop: 50,
  },
  h1: {
    paddingTop: 40,
    paddingBottom: 40,
  },
};


export default class CurrentAuctionsTable extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    if (this.props.currentAuctions && this.props.currentAuctions.length > 0) {
      return (
        <article style={styles.article}>
          <h1 className="text-center">Dossiers ouverts aux offres</h1>

          <table className="minimal-table">
            <colgroup>
              <col span="1" style={{ width: '25%' }} />
              <col span="1" style={{ width: '25%' }} />
              <col span="1" style={{ width: '25%' }} />
              <col span="1" style={{ width: '25%' }} />
            </colgroup>
            <thead>
              <tr>
                <th className="left-align">Temps Restant</th>
                <th className="left-align">Type de Projet</th>
                <th className="right-align">Taille du Projet</th>
                <th className="right-align" />
              </tr>
            </thead>
            <tbody>
              {this.props.currentAuctions.map((auction, index) => (
                <AuctionTableLine
                  auction={auction}
                  key={index}
                  index={index}
                  offers={this.props.offers}
                />
              ))}
            </tbody>
          </table>
        </article>
      );
    }

    return (
      <article style={styles.article}>
        <h1 className="text-center" style={styles.h1}>Pas d'offres en ce moment</h1>
      </article>
    );
  }
}

CurrentAuctionsTable.propTypes = {
  currentAuctions: PropTypes.arrayOf(PropTypes.any),
  offers: PropTypes.arrayOf(PropTypes.object),
};
