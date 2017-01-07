import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import AutoForm from '../forms/AutoForm.jsx';


var savingTimeout;

export default class Step1InitialForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      saved: false,
      errors: '',
      savingTimeout: null,
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
        type: 'RadioInput',
        label: 'Style de Propriété?',
        radioLabels: ['Villa', 'Appartement'],
        values: ['villa', 'flat'],
        id: 'propertyInfo.style',
        currentValue: this.props.creditRequest.propertyInfo.style,
      }, {
        type: 'TextInputNumber',
        label: <span>Surface du terrain en m<sup>2</sup></span>,
        placeholder: '200',
        id: 'propertyInfo.surfaceTotal',
        currentValue: this.props.creditRequest.propertyInfo.surfaceTotal,
        showCondition: (this.props.creditRequest.propertyInfo.style === 'villa'),
      }, {
        type: 'TextInputNumber',
        label: <span>Surface habitable en m<sup>2</sup></span>,
        placeholder: '120',
        id: 'propertyInfo.surface',
        currentValue: this.props.creditRequest.propertyInfo.surface,
      },
    ];

    return (
      <div>
        {/* Show "Currently Saving" when saving,
          and show "Saved" if currently saving has already appeared once */}
        {this.state.saving ?
          <p className="secondary bold">Sauvegarde en cours...</p> :
          (this.state.saved && <p>Sauvegardé</p>)
        }
        {<h5>{this.state.errors}</h5>}
        <AutoForm
          inputs={formArray}
          formClasses="col-sm-10 col-sm-offset-1"
          creditRequest={this.props.creditRequest}
          changeSaving={this.changeSaving}
          changeErrors={this.changeErrors}
        />
      </div>
    );
  }
}

Step1InitialForm.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};








// const formArray = [
//   {
//     type: 'ConditionalInput',
//     conditionalTrueValue: 'true',
//     inputs: [
//       {
//         type: 'RadioInput',
//         label: 'Un ou deux emprunteurs?',
//         radioLabels: ['Un', 'deux'],
//         values: ['false', 'true'],
//         id: 'personalInfo.twoBuyers',
//         currentValue: this.props.creditRequest.personalInfo.twoBuyers,
//       }, {
//         type: 'TextInputNumber',
//         label: 'Âge de votre conjoint?',
//         placeholder: '30',
//         id: 'personalInfo.age2',
//         currentValue: this.props.creditRequest.personalInfo.age2,
//       },
//     ],
//   }, {
//     type: 'TextInputNumber',
//     label: 'Votre âge?',
//     placeholder: '30',
//     id: 'personalInfo.age1',
//     currentValue: this.props.creditRequest.personalInfo.age1,
//   }, {
//     type: 'RadioInput',
//     label: 'Type de Résidence?',
//     radioLabels: ['Principale', 'Secondaire', 'Investissement'],
//     values: ['primary', 'secondary', 'investment'],
//     id: 'propertyInfo.type',
//     currentValue: this.props.creditRequest.propertyInfo.type,
//   }, {
//     type: 'TextInputMoney',
//     label: 'Votre Salaire annuel?',
//     placeholder: '30\'000',
//     id: 'financialInfo.salary',
//     currentValue: this.props.creditRequest.financialInfo.salary,
//   }, {
//     type: 'ConditionalInput',
//     conditionalTrueValue: 'true',
//     inputs: [
//       {
//         type: 'RadioInput',
//         label: 'Touchez-vous un Bonus?',
//         radioLabels: ['Oui', 'Non'],
//         values: ['true', 'false'],
//         id: 'financialInfo.bonusExists',
//         currentValue: this.props.creditRequest.financialInfo.bonusExists,
//       }, {
//         type: 'TextInputMoney',
//         label: 'Combien?',
//         placeholder: '30\'000',
//         id: 'financialInfo.bonus',
//       },
//     ],
//   }, {
//     type: 'TextInputMoney',
//     label: 'Combien voulez-vous mettre de fonds propres?',
//     placeholder: '100\'000',
//     id: 'financialInfo.fortune',
//     currentValue: this.props.creditRequest.financialInfo.fortune,
//   }, {
//     type: 'TextInputMoney',
//     label: 'Dont combien de votre LPP?',
//     placeholder: '20\'000',
//     id: 'financialInfo.insuranceFortune',
//     currentValue: this.props.creditRequest.financialInfo.insuranceFortune,
//   }, {
//     type: 'TextInputMoney',
//     label: 'Et finalement combien vaut la propriété?',
//     placeholder: '500\'000',
//     id: 'propertyInfo.value',
//     currentValue: this.props.creditRequest.propertyInfo.value,
//   },
// ];
