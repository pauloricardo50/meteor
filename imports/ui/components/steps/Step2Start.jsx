import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { updateValues } from '/imports/api/loanrequests/methods.js';
import moment from 'moment';
import CountUp from 'react-countup';


import RaisedButton from 'material-ui/RaisedButton';


const styles = {
  text: {
    textAlign: 'justify',
    padding: 20,
  },
  a: {
    marginBottom: 50,
  },
};


export default class Step2Start extends Component {
  constructor(props) {
    super(props);

    this.startAuction = this.startAuction.bind(this);
  }

  startAuction() {
    const object = {};
    object['logic.auctionStarted'] = true;
    object['logic.auctionStartTime'] = moment().toDate();
    object['logic.auctionEndTime'] = moment().add(30, 'm').toDate(); // TODO: Change this to 2 business days?
    const id = this.props.requestId;

    updateValues.call({
      object, id,
    }, (error, result) => {
      if (error) {
        throw new Meteor.Error('startAuctionFailed', 'Couldn\'t start the auction');
      } else {
        return 'Auction started Successful';
      }
    });
  }

  render() {
    return (
      <section className="mask1 animated fadeIn">
        <h1>2ème Étape <small>Commencez les enchères</small></h1>
        <div className="text-center giant" style={styles.countUp}>
          <CountUp
            className="custom-count"
            start={0}
            end={20}
            duration={3.5}
            useEasing
            separator=" "
            decimal=","
            prefix=""
            suffix=" Prêteurs"
          />
        </div>
        <a className="bold secondary active text-center col-xs-12" style={styles.a}>Voir la liste</a>
        <br />
        <p
          className="col-sm-6 col-sm-offset-3"
          style={styles.text}
        >
          Lorsque vous estimez que vos informations sont correctes
          et que vous ne voulez plus les modifier, appuyez sur envoyer.
        </p>
        <div className="col-xs-12">
          <div className="form-group text-center">
            <RaisedButton label="Envoyer" primary onClick={this.startAuction} />
          </div>
          <div className="form-group text-center">
            <RaisedButton label="Pas maintenant" onClick={() => FlowRouter.go('/step1')} />
          </div>
        </div>
      </section>
    );
  }
}


Step2Start.propTypes = {
  requestId: PropTypes.string.isRequired,
};
