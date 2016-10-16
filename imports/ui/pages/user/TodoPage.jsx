import React from 'react';
import { Meteor } from 'meteor/meteor';

import TodoCard from '/imports/ui/components/general/TodoCard.jsx';


const todoCards = [
  {
    title: 'Check-up initial',
    duration: '5 min',
    completionPercentage: 30,
    right: true,
  }, {
    title: 'Mes Partenaires Financiers Particuliers',
    duration: '20 sec',
    completionPercentage: 10,
    right: true,
  }, {
    title: 'Ma déclaration d\'impôts',
    duration: '5 sec',
    completionPercentage: 30,
    right: true,
  }, {
    title: 'Évaluer mon bien immobilier',
    duration: '2 min',
    completionPercentage: 5,
    right: true,
  }, {
    title: 'Analyse de votre demande de financement en cours..',
    duration: '48 h',
    completionPercentage: 0,
    right: false,
  },
];

const steps = {
  one: 3,
  two: 4,
  three: 8,
  four: 9,
  five: 12,
};

export default class TodoPage extends React.Component {

  componentWillMount() {
    Session.set('view', '');
  }

  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div className="text-center" id="todo-text-top">Appuyez sur une carte incomplète pour avancer</div>
        <hr id="todo-hr-top" />
        {todoCards.map((card, index) => {
          return (<TodoCard
            // creditRequest={this.props.creditRequest}
            title={card.title}
            duration={card.duration}
            completionPercentage={card.completionPercentage}
            right={card.right}
            cardId={index}
            key={index}
          />);
        })}
      </div>
    );
  }
}
