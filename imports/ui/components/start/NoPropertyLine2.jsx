import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';

import { maxPropertyValue } from '/imports/js/finance-math.js';
import { toMoney } from '/imports/js/conversionFunctions';


const styles = {
  buttons: {
    marginTop: 50,
  },
};


export default class NoPropertyLine2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      maxProperty: 0,
      maxBorrow: 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {

    // Component should always update because it depends on all values together
    return true;
  }

  componentWillReceiveProps(nextProps) {
    const [maxProperty, maxBorrow] = maxPropertyValue(
      Number(nextProps.age1),
      Number(nextProps.age2),
      nextProps.gender1,
      nextProps.gender2,
      Number(nextProps.salary) + Number(nextProps.bonus),
      Number(nextProps.fortune),
      Number(nextProps.insuranceFortune),
    );

    this.setState({
      maxProperty,
      maxBorrow: maxBorrow * maxProperty,
    });
  }

  render() {
    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          Vous pouvez emprunter au maximum CHF&nbsp;
          {toMoney(this.state.maxBorrow)}
          &nbsp;et donc acheter une propriété de CHF&nbsp;
          {toMoney(this.state.maxProperty)}
          .
        </h1>
        <div className="col-xs-12 text-center" style={styles.buttons}>
          <RaisedButton label="Chercher une propriété à ce prix" primary />
        </div>
      </article>
    );
  }
}

NoPropertyLine2.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};
