import React from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';

import InitialForm from '/imports/ui/components/forms/InitialForm.jsx';

export default class DoPage extends React.Component {

  render() {
    // If the view sessions variable is empty, go back
    if (!Session.get('view')) {
      FlowRouter.go(`/${FlowRouter.getParam('id')}/todo`);
    }
    return (
      <article>
        <div className="form-group">
          <a
            href={`/${FlowRouter.getParam('id')}/todo`}
            className="btn btn-default animated slideInLeft"
            id="back"
          >
            <span className="fa fa-angle-left" /> Retour
          </a>
        </div>
        {FlowRouter.getParam('cardId') === '0' ? <InitialForm /> : ''}
      </article>
    );
  }
}


const forms = [
  [
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
  ],

  [
    {
      label: 'Quelle est votre banque personelle?'
    },
  ]
]
