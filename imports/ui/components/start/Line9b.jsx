import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';

import { toMoney, toNumber } from '/imports/js/finance-math.js';


const styles = {
  buttons: {
    marginTop: 50,
  },
};


export default class Line9b extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {

    // Component should always update because it depends on all values together
    return true;
  }

  render() {
    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          Vous pouvez emprunter au maximum CHF 400'000 et donc acheter une propriété de CHF 500'000.
        </h1>
        <div className="col-xs-12 text-center" style={styles.buttons}>
          <RaisedButton label="Chercher une propriété à ce prix" primary />
        </div>
      </article>
    );
  }
}

Line9b.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};
