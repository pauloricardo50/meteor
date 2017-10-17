import PropTypes from 'prop-types';
import React from 'react';

import CurrentAuctionsTable from '/imports/ui/components/partner/CurrentAuctionsTable';
import PastOffersTable from '/imports/ui/components/partner/PastOffersTable';

// const dummyAuctions = [
//   {
//     auctionEndTime: moment(new Date()).add(1, 'hours'),
//     value: 789000,
//     type: 'Acquisition',
//     _id: 123,
//   }, {
//     auctionEndTime: moment(new Date()).add(13, 'hours'),
//     value: 1012000,
//     type: 'Refinancement',
//     _id: 234,
//   }, {
//     auctionEndTime: moment(new Date()).add(1, 'days'),
//     value: 564000,
//     type: 'Acquisition',
//     _id: 234,
//   },
// ];

const styles = {
  section: {
    maxWidth: 1200,
    margin: 'auto',
  },
  noAuctionDiv: {
    display: 'block',
    paddingTop: 40,
    paddingBottom: 40,
  },
};

const purchaseTypes = {
  acquisition: 'Acquisition',
  refinancing: 'Refinancement',
  construction: 'Contruction',
};

const getCurrentAuctions = (loanRequests) => {
  const auctions = [];

  loanRequests.forEach((request) => {
    if (request.logic.auction.status === 'started') {
      auctions.push({
        auctionEndTime: request.logic.auction.endTime,
        value: request.property.value,
        type: purchaseTypes[request.general.purchaseType],
        _id: request._id,
      });
    }
  });

  return auctions;
};

const getPartnerLogo = () => '/partners/UBS_logo.png';

const PartnerHomePage = ({ loanRequests, currentOffers, oldOffers }) => {
  const currentAuctions = getCurrentAuctions(loanRequests);

  return (
    <section className="mask1" style={styles.section}>
      <div className="partner-logos">
        <img src={getPartnerLogo()} alt="Logo Partenaire" className="partner" />
        <img src="/img/logo_black.svg" alt="Logo e-Potek" className="epotek" />
      </div>

      {currentAuctions.length ? (
        <CurrentAuctionsTable
          currentAuctions={currentAuctions}
          offers={currentOffers}
        />
      ) : (
        <div className="text-center col-xs-12" style={styles.noAuctionDiv}>
          <h2>Aucune nouvelle offre à faire en ce moment.</h2>
        </div>
      )}

      <div className="col-xs-12">
        <hr className="col-xs-4 col-xs-offset-4" />
      </div>

      <PastOffersTable offers={oldOffers} />
    </section>
  );
};

PartnerHomePage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  currentOffers: PropTypes.arrayOf(PropTypes.object),
  oldOffers: PropTypes.arrayOf(PropTypes.object),
};

PartnerHomePage.defaultProps = {
  loanRequests: [],
  currentOffers: [],
  oldOffers: [],
};

export default PartnerHomePage;
