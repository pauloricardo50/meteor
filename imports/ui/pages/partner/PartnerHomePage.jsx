import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';

import PartnerStats from '/imports/ui/components/partner/PartnerStats.jsx';
import CurrentAuctionsTable
  from '/imports/ui/components/partner/CurrentAuctionsTable.jsx';
import PastOffersTable
  from '/imports/ui/components/partner/PastOffersTable.jsx';

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

var time;

export default class PartnerHomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: undefined,
    };

    this.getCurrentAuctions = this.getCurrentAuctions.bind(this);
  }

  componentDidMount() {
    time = Meteor.setInterval(
      () => {
        this.setState({ currentTime: new Date() });
      },
      1000,
    );
  }

  componentWillUnmount() {
    Meteor.clearInterval(time);
  }

  getCurrentAuctions() {
    const auctions = [];
    this.props.loanRequests.forEach((request, index) => {
      // TODO replace this if with better logic, maybe server side "auctionHasEnded"
      // TODO get server time for this comparison
      if (
        !request.general.selectedPartner &&
        !(request.logic.auctionEndTime <= this.state.currentTime)
      ) {
        const object = {
          auctionEndTime: request.logic.auctionEndTime,
          value: request.property.value,
          type: purchaseTypes[request.general.purchaseType],
          _id: request._id,
        };
        auctions.push(object);
      }
    });

    return auctions;
  }

  getPartnerLogo() {
    return '/partners/UBS_logo.png';
  }

  render() {
    return (
      <section className="mask1" style={styles.section}>
        <div className="partner-logos">
          <img
            src={this.getPartnerLogo()}
            alt="Logo Partenaire"
            className="partner"
          />
          <img
            src="/img/logo_black.svg"
            alt="Logo e-Potek"
            className="epotek"
          />
        </div>

        {/* <PartnerStats /> */}

        {this.getCurrentAuctions().length
          ? <CurrentAuctionsTable
              currentAuctions={this.getCurrentAuctions()}
              offers={this.props.currentOffers}
            />
          : <div className="text-center col-xs-12" style={styles.noAuctionDiv}>
              <h2>Aucune nouvelle offre à faire en ce moment.</h2>
            </div>}

        <div className="col-xs-12">
          <hr className="col-xs-4 col-xs-offset-4" />
        </div>

        <PastOffersTable offers={this.props.oldOffers} />

      </section>
    );
  }
}

PartnerHomePage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  currentOffers: PropTypes.arrayOf(PropTypes.object),
  oldOffers: PropTypes.arrayOf(PropTypes.object),
};
