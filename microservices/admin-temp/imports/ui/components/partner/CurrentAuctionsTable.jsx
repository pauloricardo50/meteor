import PropTypes from 'prop-types';
import React from 'react';

import AuctionTableLine from '/imports/ui/components/partner/AuctionTableLine';

const styles = {
  article: {
    marginTop: 50,
  },
  h1: {
    paddingTop: 40,
    paddingBottom: 40,
  },
};

const CurrentAuctionsTable = props => {
  if (props.currentAuctions && props.currentAuctions.length > 0) {
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
            {props.currentAuctions.map((auction, index) =>
              <AuctionTableLine
                auction={auction}
                key={auction._id}
                index={index}
                offers={props.offers}
              />,
            )}
          </tbody>
        </table>
      </article>
    );
  }

  return (
    <article style={styles.article}>
      <h1 className="text-center" style={styles.h1}>
        Pas d'offres en ce moment
      </h1>
    </article>
  );
};

CurrentAuctionsTable.propTypes = {
  currentAuctions: PropTypes.arrayOf(PropTypes.any),
  offers: PropTypes.arrayOf(PropTypes.object),
};

export default CurrentAuctionsTable;
