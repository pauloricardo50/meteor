import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';

import AutoForm from './AutoForm.jsx'

const formArray = [
  {
    type: 'ConditionalInput',
    conditionalTrueValue: 'deux',
    inputs: [
      {
        type: 'RadioInput',
        label: 'Un ou deux emprunteurs?',
        values: ['Un', 'deux'],
        default: 0,
      }, {
        type: 'TextInputNumber',
        label: 'Âge de votre conjoint?',
        placeholder: '30',
        id: 'age2',
      },
    ],
  }, {
    type: 'TextInputNumber',
    label: 'Votre âge?',
    placeholder: '30',
    id: 'age1',
  }, {
    type: 'RadioInput',
    label: 'Type de Résidence?',
    values: ['Principale', 'Secondaire'],
    default: 0,
  }, {
    type: 'TextInputMoney',
    label: 'Votre Salaire?',
    placeholder: '80\'000',
    id: 'salary',
  }, {
    type: 'ConditionalInput',
    conditionalTrueValue: 'Oui',
    inputs: [
      {
        type: 'RadioInput',
        label: 'Touchez-vous un Bonus?',
        values: ['Oui', 'Non'],
        default: 1,
      }, {
        type: 'TextInputMoney',
        label: 'Combien?',
        placeholder: '10\'000',
        id: 'bonus',
      },
    ],
  }, {
    type: 'TextInputMoney',
    label: 'Combien voulez-vous mettre de fonds propres?',
    placeholder: '100\'000',
    id: 'fortune',
  }, {
    type: 'TextInputMoney',
    label: 'Dont combien de votre LPP?',
    placeholder: '40\'000',
    id: 'insuranceFortune',
  }, {
    type: 'TextInputMoney',
    label: 'Et finalement combien vaut la propriété?',
    placeholder: '500\'000',
    id: 'propertyValue',
  },
];


export default class InitialForm extends React.Component {

  onSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <Panel>
        <AutoForm
          inputs={formArray}
          formClasses="col-sm-10 col-sm-offset-1"
          onSubmit={this.onSubmit}
        />
      </Panel>
    );
  }
}
