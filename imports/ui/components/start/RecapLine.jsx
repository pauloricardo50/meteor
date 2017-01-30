import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import CountUp from 'react-countup';

import RaisedButton from 'material-ui/RaisedButton';

import ProjectChart from '/imports/ui/components/charts/ProjectChart.jsx';

const styles = {
  article: {
    color: 'unset',
    height: 'unset',
    lineHeight: 'unset',
  },
  topH1: {
    paddingTop: 25,
    paddingBottom: 25,
  },
  finalButtons: {
    marginTop: 50,
  },
  button: {
    marginBottom: 16,
  },
  mobileChart: {
    width: '75%',
    margin: 'auto',
  },
};

export default class RecapLine extends Component {
  constructor(props) {
    super(props);

    // Makes the Countup not always start from 0
    this.state = {
      countedOnce: false,
      previousCountup: 0,
      nextCountup: 0,
    };

    this.handleClick = this.handleClick.bind(this);
    this.counterCallback = this.counterCallback.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // If the counter has gone up once, make it only count from the changed values
    if (this.state.countedOnce) {
      this.setState({
        previousCountup:
          Number(this.props.propertyValue) -
          Number(this.props.fortune) -
          Number(this.props.insuranceFortune),
        nextCountup:
          Number(nextProps.propertyValue) -
          Number(nextProps.fortune) -
          Number(nextProps.insuranceFortune),
      });
    } else {
      this.setState({
        nextCountup:
          Number(nextProps.propertyValue) -
          Number(nextProps.fortune) -
          Number(nextProps.insuranceFortune),
      });
    }
  }

  handleClick(e) {
    if (Meteor.user()) {
      this.handleSuccess();
    } else {
      this.props.completeStep(e, true, true);
    }
  }


  counterCallback() {
    this.setState({ countedOnce: true });
  }

  handleSuccess() {
    // If the form is good, prepare path and route to it
    //if (this.props.isValid && this.props.isFinished) {
    if (true) {
      const p = this.props;
      const pathDef = '/new';
      const params = {};
      const queryParams = {
        twoBuyers: p.twoBuyers,
        age1: p.age1,
        age2: p.age2,
        genderRequired: p.genderRequired,
        gender1: p.gender1,
        gender2: p.gender2,
        purchaseType: p.purchaseType,
        propertyType: p.propertyType,
        salary: p.salary,
        bonusExists: p.bonusExists,
        bonus: p.bonus,
        propertyKnown: p.propertyKnown,
        propertyValue: p.propertyValue,
        maxCash: p.maxCash,
        maxDebt: p.maxDebt,
        fortune: p.fortune,
        insuranceFortune: p.insuranceFortune,
      };

      const path = FlowRouter.path(pathDef, params, queryParams);

      FlowRouter.go(path);
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep} className={this.props.classes.text += ' mask1'} style={styles.article}>
        <h1 className="col-xs-12 text-center" style={styles.topH1}>
          Tout est bon, ça va être une magnifique affaire!
        </h1>
        <div className="hidden-sm hidden-md hidden-lg" style={styles.mobileChart}>
          <ProjectChart
            horizontal={false}
            name="Votre Projet"
            propertyValue={Number(this.props.propertyValue)}
            fortuneUsed={Number(this.props.fortune)}
            insuranceFortuneUsed={Number(this.props.insuranceFortune)}
            divName="mobileChart"
          />
        </div>
        <div className="hidden-xs">
          <ProjectChart
            horizontal
            name="Votre Projet"
            propertyValue={Number(this.props.propertyValue)}
            fortuneUsed={Number(this.props.fortune)}
            insuranceFortuneUsed={Number(this.props.insuranceFortune)}
            divName="regularChart"
          />
        </div>
        {/* <div className="col-sm-4 col-sm-offset-1 col-xs-6 text-center">
          <span className="fa fa-home fa-3x" />
          <br />
          <h1>
            Votre propriété
            <br />
            <CountUp
              className="custom-count"
              start={0}
              end={Number(this.props.propertyValue)}
              duration={2}
              useEasing
              separator="'"
              useGrouping
              decimal="."
              prefix="CHF "
              suffix=""
            />
          </h1>
        </div>
        <div className="col-sm-4 col-sm-offset-2 col-xs-6 text-center">
          <span className="fa fa-money fa-3x" />
          <br />
          <h1>
            Votre emprunt
            <br />
            <CountUp
              className="custom-count"
              start={Number(this.state.previousCountup)}
              end={Number(this.state.nextCountup)}
              duration={2}
              useEasing
              separator="'"
              useGrouping
              decimal="."
              prefix="CHF "
              suffix=""
              callback={this.counterCallback}
            />
          </h1>
        </div> */}
        <div className="col-xs-12 text-center form-group" style={styles.finalButtons}>
          <RaisedButton
            label="Continuer"
            style={styles.button}
            onClick={this.handleClick}
            primary
          />
        </div>

      </article>
    );
  }
}

RecapLine.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  propertyValue: PropTypes.string.isRequired,
  fortune: PropTypes.string.isRequired,
  insuranceFortune: PropTypes.string.isRequired,
  isFinished: PropTypes.bool.isRequired,
  isValid: PropTypes.arrayOf(PropTypes.bool).isRequired,
};
