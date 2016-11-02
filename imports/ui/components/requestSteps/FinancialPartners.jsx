import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';

import AutoForm from '../forms/AutoForm.jsx';

const formArray = [
  {
    type: 'TextInput',
    label: 'Quelle est votre banque personelle ?',
    placeholder: 'UBS',
    id: 'personalBank',
  }, {
    type: 'ConditionalInput',
    conditionalTrueValue: 'Oui',
    inputs: [
      {
        type: 'RadioInput',
        label: 'Avez-vous une banque préférentielle au travail?',
        values: ['Oui', 'Non'],
        default: 1,
      }, {
        type: 'TextInput',
        label: 'Laquelle?',
        placeholder: 'UBS',
        id: 'corporateBank',
      },
    ],
  }, {
    type: 'ConditionalInput',
    conditionalTrueValue: 'Oui',
    inputs: [
      {
        type: 'RadioInput',
        label: 'Y-a-t\'il un établissement financier que nous devons éviter?',
        values: ['Oui', 'Non'],
        default: 1,
      }, {
        type: 'TextInput',
        label: 'Lequel?',
        placeholder: 'UBS',
        id: 'avoidBank',
      },
    ],
  },
];


export default class FinancialPartners extends React.Component {

  onSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="mask1">
        <h3>Mes partenaires financiers particuliers</h3>
        <AutoForm
          inputs={formArray}
          formClasses="col-sm-10 col-sm-offset-1"
          onSubmit={this.onSubmit}
        />
      </div>
    );
  }
}
