import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import AutoForm from '../forms/AutoForm.jsx';


var savingTimeout;

export default class Step1TaxesForm extends Component {
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
    savingTimeout = Meteor.setTimeout(() => {
      this.setState({
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
        type: 'ConditionalInput',
        conditionalTrueValue: 'true',
        inputs: [
          {
            type: 'RadioInput',
            label: 'Êtes-vous actuellement locataire ?',
            radioLabels: ['Oui', 'Non'],
            values: ['true', 'false'],
            id: 'financialInfo.currentRentExists',
            currentValue: this.props.creditRequest.financialInfo.currentRentExists,
          }, {
            type: 'TextInputMoney',
            label: 'Quel est votre loyer annuel?',
            placeholder: 'CHF 6\'000',
            id: 'financialInfo.currentRent',
            currentValue: this.props.creditRequest.financialInfo.currentRent,
          },
        ],
      }, {
        type: 'TextInputMoney',
        label: 'Quelle est la valeur de vos biens immobiliers existants ?',
        placeholder: 'CHF 100\'000',
        id: 'financialInfo.realEstateFortune',
        currentValue: this.props.creditRequest.financialInfo.realEstateFortune,
      }, {
        type: 'TextInputMoney',
        label: 'Quelle est votre fortune totale en cash et titres, y compris ce que vous allez allouer à ce projet ?',
        placeholder: 'CHF 10\'000',
        id: 'financialInfo.totalCashFortune',
        currentValue: this.props.creditRequest.financialInfo.totalCashFortune,
      }, {
        type: 'ConditionalInput',
        conditionalTrueValue: 'true',
        inputs: [
          {
            type: 'RadioInput',
            label: 'Avez-vous un autre élément de fortune pas mentionné jusqu\'ici ?',
            radioLabels: ['Oui', 'Non'],
            values: ['true', 'false'],
            id: 'financialInfo.otherFortuneExists',
            currentValue: this.props.creditRequest.financialInfo.otherFortuneExists,
          }, // {
          //   type: 'TextInputMoney',
          //   label: 'Combien ?',
          //   placeholder: 'CHF 1\'000',
          //   id: 'financialInfo.otherFortune.$.value',
          //   currentValue: this.props.creditRequest.financialInfo.otherFortune[0].value,
          // }, {
          //   type: 'TextInput',
          //   label: 'Donnez une courte description',
          //   placeholder: 'Yannis?',
          //   id: 'financialInfo.otherFortune.$.description',
          //   currentValue: this.props.creditRequest.financialInfo.otherFortune[0].description,
          // },
        ],
      },
    ];


    return (
      <span>
        {this.state.saving ?
          <p className="secondary bold">Sauvegarde en cours...</p> :
          (this.state.saved && <p>Sauvegardé</p>)
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
      </span>
    );
  }
}

Step1TaxesForm.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
