import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import AutoForm from '../forms/AutoForm.jsx';


var savingTimeout;

export default class FinancialPartners extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      saved: false,
      errors: '',
    };

    this.changeSaving = this.changeSaving.bind(this);
    this.changeErrors = this.changeErrors.bind(this);
  }


  componentWillUnmount() {
    Meteor.clearTimeout(savingTimeout);
  }


  changeSaving(value) {
    // If the value is false, wait for half a second before changing state,
    // so that the saving appears smoothly to the user
    Meteor.clearTimeout(savingTimeout);
    var that = this;
    savingTimeout = Meteor.setTimeout(function () {
      that.setState({
        saving: value,
        saved: true,
      });
    }, (value ? 0 : 500));
  }


  // TODO: Allow multiple errors via push, and maintain current errors
  // Currently, it replaces all current errors with the new value
  changeErrors(value) {
    this.setState({
      errors: value,
    });
  }


  render() {
    const formArray = [
      {
        type: 'TextInput',
        label: 'Quelle est votre banque personelle ?',
        placeholder: 'UBS',
        id: 'financialInfo.personalBank',
        currentValue: this.props.creditRequest.financialInfo.personalBank,
      }, {
        type: 'ConditionalInput',
        conditionalTrueValue: 'true',
        inputs: [
          {
            type: 'RadioInput',
            label: 'Avez-vous une banque préférentielle au travail?',
            radioLabels: ['Oui', 'Non'],
            values: ['true', 'false'],
            id: 'financialInfo.corporateBankExists',
            currentValue: this.props.creditRequest.financialInfo.corporateBankExists,
          }, {
            type: 'TextInput',
            label: 'Laquelle?',
            placeholder: 'UBS',
            id: 'financialInfo.corporateBank',
            currentValue: this.props.creditRequest.financialInfo.corporateBank,
          },
        ],
      }, {
        type: 'ConditionalInput',
        conditionalTrueValue: 'true',
        inputs: [
          {
            type: 'RadioInput',
            label: 'Y-a-t\'il un établissement financier que nous devons éviter?',
            radioLabels: ['Oui', 'Non'],
            values: ['true', 'false'],
            id: 'financialInfo.avoidLenderExists',
            currentValue: this.props.creditRequest.financialInfo.avoidLenderExists,
          }, {
            type: 'TextInput',
            label: 'Lequel?',
            placeholder: 'UBS',
            id: 'financialInfo.avoidLender',
            currentValue: this.props.creditRequest.financialInfo.avoidLender,
          },
        ],
      },
    ];


    return (
      <div className="mask1">
        <h3>Mes partenaires financiers particuliers</h3>
        {/* Show "Currently Saving" when saving,
          and show "Saved" if currently saving has already appeared once */}
        {this.state.saving ?
          <p className="secondary bold">Sauvegarde en cours...</p> :
          (this.state.saved ? <p>Sauvegardé</p> : null)
        }
        {<h5>{this.state.errors}</h5>}
        <AutoForm
          inputs={formArray}
          formClasses="col-sm-10 col-sm-offset-1"
          onSubmit={this.onSubmit}
          creditRequest={this.props.creditRequest}
          changeSaving={this.changeSaving}
          changeErrors={this.changeErrors}
        />
      </div>
    );
  }
}

FinancialPartners.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
