import React, { Component, PropTypes } from 'react';


import OfferTableLine from '/imports/ui/components/partner/OfferTableLine.jsx';

const styles = {
  article: {
    display: 'inline-block',
    width: '100%',
  },
};

export default class PastOffersTable extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <article style={styles.article}>
        <h1 className="text-center">Offres passées</h1>

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
            {this.props.offers.map((offer, index) => (
              <OfferTableLine
                offer={offer}
                key={index}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </article>
    );
  }
}

PastOffersTable.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.any).isRequired,
};
