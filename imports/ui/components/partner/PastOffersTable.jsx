import PropTypes from 'prop-types';
import React from 'react';

import OfferTableLine from '/imports/ui/components/partner/OfferTableLine';

const styles = {
  article: {
    display: 'inline-block',
    width: '100%',
  },
};

const PastOffersTable = props =>
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
        {props.offers.map((offer, i) =>
          <OfferTableLine offer={offer} key={offer._id} index={i} />,
        )}
      </tbody>
    </table>
  </article>;

PastOffersTable.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default PastOffersTable;
