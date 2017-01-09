import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';

import RaisedButton from 'material-ui/RaisedButton';

import Step1Part1 from '/imports/ui/components/steps/Step1Part1.jsx';
import Step1Part2 from '/imports/ui/components/steps/Step1Part2.jsx';
import { updateValues } from '/imports/api/loanrequests/methods.js';


const styles = {
  button: {
    float: 'right',
  },
};

export default class Step1Page extends Component {
  constructor(props) {
    super(props);

    this.isReady = this.isReady.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 1 - e-Potek');
  }


  isReady() {
    let projectReady = false;
    let taxesReady = false;

    // TODO define when step1 is done

    return true;
  }

  handleClick() {
    if (this.isReady()) {

      const object = {};
      object['logic.step'] = 1;
      const id = this.props.loanRequest._id;

      updateValues.call({
        object, id,
      }, (error, result) => {
        if (error) {
          throw new Meteor.Error(500, error.message);
        } else {
          // Head to step 2
          FlowRouter.go('/step2');
          return 'Update Successful';
        }
      });
    }
  }

  render() {
    return (
      <section className="animated fadeIn">

        <h1 className="stepTitle">
          1ère Étape
          <small> Encore quelques informations avant qu'on se mette au travail</small>
        </h1>

        <Step1Part1 loanRequest={this.props.loanRequest} />
        <Step1Part2 loanRequest={this.props.loanRequest} />

        <RaisedButton
          label="Continuer"
          disabled={!this.isReady()}
          primary
          style={styles.button}
          onClick={this.handleClick}
        />

      </section>
    );
  }
}


Step1Page.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
