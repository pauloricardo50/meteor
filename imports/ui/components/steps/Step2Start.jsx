import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import cleanMethod from '/imports/api/cleanMethods';
import CountUp from 'react-countup';


import RaisedButton from 'material-ui/RaisedButton';


import Step2PartnersForm from './Step2PartnersForm.jsx';


const styles = {
  text: {
    textAlign: 'justify',
    padding: 20,
  },
  a: {
    marginBottom: 50,
  },
  formDiv: {
    marginBottom: 40,
    width: '100%',
    display: 'inline-block',
  },
};


export default class Step2Start extends Component {
  constructor(props) {
    super(props);

    this.startAuction = this.startAuction.bind(this);
  }

  startAuction() {
    cleanMethod('startAuction', this.props.loanRequest._id);
  }

  render() {
    return (
      <section className="mask1">
        <h2>Derniers réglages avant de commencer</h2>
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

        <div style={styles.formDiv}>
          <Step2PartnersForm loanRequest={this.props.loanRequest} />
        </div>

        <div className="col-xs-12">
          <div className="form-group text-center">
            <RaisedButton label="Commencer les enchères" primary onClick={this.startAuction} />
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
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
