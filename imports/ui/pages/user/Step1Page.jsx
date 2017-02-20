import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';

import RaisedButton from 'material-ui/RaisedButton';

import Step1InitialForm from '/imports/ui/components/steps/Step1InitialForm.jsx';
import TextInput from '/imports/ui/components/forms/TextInput.jsx';

import cleanMethod from '/imports/api/cleanMethods';
import { toMoney } from '/imports/js/conversionFunctions';


const styles = {
  mainDiv: {
    marginBottom: 40,
  },
  topValue: {
    margin: '80px 0 100px 0',
  },
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

      cleanMethod('update', id, object,
        (error) => {
          if (!error) {
            // Head to step 2
            FlowRouter.go('/step2');
          }
        });
    }
  }

  render() {
    return (
      <div>

        <h1 className="stepTitle">
          1ère Étape
          <small> Encore quelques informations avant qu&apos;on se mette au travail</small>
        </h1>

        <section className="mask1 animated fadeIn" style={styles.mainDiv}>
          <div className="primary-top">
            <h3 className="bold">{this.props.loanRequest.property.address1}</h3>
            <div className="text-center">
              <h1 className="display1" style={styles.topValue}>
                CHF {toMoney(this.props.loanRequest.property.value)}
              </h1>
            </div>
          </div>
          <Step1InitialForm loanRequest={this.props.loanRequest} />
        </section>

        <RaisedButton
          label="Continuer"
          disabled={!this.isReady()}
          primary
          style={styles.button}
          onClick={this.handleClick}
        />

      </div>
    );
  }
}


Step1Page.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
