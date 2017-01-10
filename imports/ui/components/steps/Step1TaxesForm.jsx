import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import AutoForm from '../forms/AutoForm.jsx';


var savingTimeout;

export default class Step1TaxesForm extends Component {
  constructor(props) {
    super(props);

    this.getFormArray = this.getFormArray.bind(this);
  }


  componentWillUnmount() {
    Meteor.clearTimeout(savingTimeout);
  }


  getFormArray() {
    return [
      {
        type: 'ConditionalInput',
        conditionalTrueValue: true,
        inputs: [
          {
            type: 'RadioInput',
            label: 'Êtes-vous actuellement locataire ?',
            radioLabels: ['Oui', 'Non'],
            values: [true, false],
            id: 'borrowers.0.currentRentExists',
            currentValue: this.props.loanRequest.borrowers[0].currentRentExists,
          }, {
            type: 'TextInputMoney',
            label: 'Loyer mensuel',
            placeholder: 'CHF 1\'500',
            id: 'borrowers.0.currentRent',
            currentValue: this.props.loanRequest.borrowers[0].currentRent,
          },
        ],
      }, {
        type: 'TextInputMoney',
        label: 'Valeur de vos biens immobiliers existants',
        placeholder: 'CHF 100\'000',
        id: 'borrowers.0.realEstateFortune',
        currentValue: this.props.loanRequest.borrowers[0].realEstateFortune,
      }, {
        type: 'TextInputMoney',
        label: 'Fortune totale en cash et titres',
        placeholder: 'CHF 10\'000',
        id: 'borrowers.0.cashAndSecurities',
        currentValue: this.props.loanRequest.borrowers[0].cashAndSecurities,
        info: 'Y compris ce que vous allez allouer à ce projet',
      },
      // {
      //   type: 'ConditionalInput',
      //   conditionalTrueValue: 'true',
      //   inputs: [
      //     {
      //       type: 'RadioInput',
      //       label: 'Avez-vous un autre élément de fortune pas mentionné jusqu\'ici ?',
      //       radioLabels: ['Oui', 'Non'],
      //       values: ['true', 'false'],
      //       id: 'borrowers.0.otherFortuneExists',
      //       currentValue: this.props.loanRequest.financialInfo.otherFortuneExists,
      //     }, {
          //   type: 'TextInputMoney',
          //   label: 'Combien ?',
          //   placeholder: 'CHF 1\'000',
          //   id: 'financialInfo.otherFortune.$.value',
          //   currentValue: this.props.loanRequest.financialInfo.otherFortune[0].value,
          // }, {
          //   type: 'TextInput',
          //   label: 'Donnez une courte description',
          //   placeholder: 'Yannis?',
          //   id: 'financialInfo.otherFortune.$.description',
          //   currentValue: this.props.loanRequest.financialInfo.otherFortune[0].description,
          // },
        // ],
    ];

  }


  render() {
    return (
      <AutoForm
        inputs={this.getFormArray()}
        formClasses="col-sm-10 col-sm-offset-1"
        loanRequest={this.props.loanRequest}
      />
    );
  }
}

Step1TaxesForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
