import React from 'react';

import Panel from 'react-bootstrap/lib/Panel';

import TextInput from '../forms/TextInput.jsx';
import TextInputMoney from '../forms/TextInputMoney.jsx';
import RadioInput from '../forms/RadioInput.jsx';


const form = [
  {
    label: 'Type de Demande',
    type: 'dropdown',
  }, {
    label: '1 ou 2 emprunteurs',
    type: 'dropdown',
  }, {
    label: 'Age(s)',
    type: 'number',
  }, {
    label: 'Résidence',
    type: 'dropdown',
  }, {
    label: 'Salaire',
    type: 'money',
  }, {
    label: 'Bonus',
    type: 'money',
  }, {
    label: 'Fonds Propres',
    type: 'money',
  }, {
    label: 'LPP',
    type: 'money',
  }, {
    label: 'Valeur de la Propriété',
    type: 'money',
  },
];


export default class InitialForm extends React.Component {
  render() {
    return (
      <Panel>
        <form className="col-sm-10 col-sm-offset-1">

          <TextInput
            label="Votre Banque"
            placeholder="UBS SA"
            id="bank"
          />

          <TextInputMoney
            label="Salaire"
            placeholder="100'000"
            id="salary"
          />

          <RadioInput
            label="Est-ce correct?"
            value1="Oui"
            value2="Non"
            onChange={() => (console.log("he"))}
          />

        </form>
      </Panel>
    );
  }
}
