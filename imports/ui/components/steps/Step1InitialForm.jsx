import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import AutoForm from '../forms/AutoForm.jsx';


export default class Step1InitialForm extends Component {
  constructor(props) {
    super(props);

    this.getFormArray = this.getFormArray.bind(this);
  }


  getFormArray() {
    const r = this.props.loanRequest;
    return [
      {
        type: 'DropzoneInput',
        array: [
          {
            title: 'Acte d\'achat',
            folderName: 'buyersContract',
            currentValue: this.props.loanRequest.general.files.buyersContract,
            id: 'general.files.buyersContract',
          },
        ],
      }, {
        type: 'RadioInput',
        label: 'Style de Propriété',
        radioLabels: ['Villa', 'Appartement'],
        values: ['villa', 'flat'],
        id: 'property.style',
        currentValue: r.property.style,
      }, {
        type: 'TextInputNumber',
        label: <span>Surface du terrain en m<sup>2</sup></span>,
        placeholder: '200',
        id: 'property.landArea',
        currentValue: r.property.landArea,
        showCondition: r.property.style === 'villa',
      }, {
        type: 'TextInputNumber',
        label: <span>Surface habitable en m<sup>2</sup></span>,
        placeholder: '120',
        id: 'property.insideArea',
        currentValue: r.property.insideArea,
      }, {
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
        label: 'Biens immobiliers existants',
        placeholder: 'CHF 100\'000',
        id: 'borrowers.0.realEstateFortune',
        currentValue: this.props.loanRequest.borrowers[0].realEstateFortune,
      }, {
        type: 'TextInputMoney',
        label: 'Cash et titres',
        placeholder: 'CHF 10\'000',
        id: 'borrowers.0.cashAndSecurities',
        currentValue: this.props.loanRequest.borrowers[0].cashAndSecurities,
        info: 'Y compris ce que vous allez allouer à ce projet',
      },
      // {
      //   type: 'ArrayInput',
      //   currentValue: this.props.loanRequest.borrowers[0].otherIncome,
      //   id: `borrowers.0.otherIncome`,
      //   components: [
      //     {
      //       type: 'TextInput',
      //       id: 'value',
      //       label: 'Autre revenu',
      //     }, {
      //       type: 'TextInput',
      //       id: 'description',
      //       label: 'Description',
      //     },
      //   ],
      // },
    ];
  }


  render() {
    return (
      <AutoForm
        inputs={this.getFormArray()}
        loanRequest={this.props.loanRequest}
      />
    );
  }
}

Step1InitialForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
