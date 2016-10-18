import React from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';

import InitialForm from '/imports/ui/components/requestSteps/InitialForm.jsx';

export default class DoPage extends React.Component {

  renderCardContent() {
    switch (FlowRouter.getParam('cardId')) {
      case '0': return <InitialForm />;
      default: return '';
    }
  }

  render() {
    // If the view sessions variable is empty, go back
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
        {this.renderCardContent()}
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
