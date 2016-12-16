import React, { Component, PropTypes } from 'react';
import moment from 'moment';


import PartnerStats from '/imports/ui/components/partner/PartnerStats.jsx';
import CurrentAuctionsTable from '/imports/ui/components/partner/CurrentAuctionsTable.jsx';
import PastOffersTable from '/imports/ui/components/partner/PastOffersTable.jsx';


const dummyAuctions = [
  {
    auctionEndTime: moment(new Date()).add(1, 'hours'),
    value: 789000,
    type: 'Acquisition',
    _id: 123,
  }, {
    auctionEndTime: moment(new Date()).add(13, 'hours'),
    value: 1012000,
    type: 'Refinancement',
    _id: 234,
  }, {
    auctionEndTime: moment(new Date()).add(1, 'days'),
    value: 564000,
    type: 'Acquisition',
    _id: 234,
  },
];


const styles = {
  section: {
    maxWidth: 1200,
    margin: 'auto',
  },
  logo: {
    width: '50%',
    maxWidth: 400,
  },
};

export default class PartnerHomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="mask1" style={styles.section}>
        <div className="text-center">
          <img src="partners/UBS_logo.png" alt="Logo Partenaire" style={styles.logo} />
        </div>

        {/* <PartnerStats /> */}

        <CurrentAuctionsTable currentAuctions={dummyAuctions} />

        <PastOffersTable />

      </section>
    );
  }
}

PartnerHomePage.propTypes = {
};
