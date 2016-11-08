import React, { PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import TodoCard from '/imports/ui/components/general/TodoCard.jsx';


const todoCards = [
  {
    title: 'Verser les fonds propres chez le notaire',
    duration: '20 min',
  }, {
    title: 'Obtenir un certificat auprès de votre caisse de pension',
    duration: '5 min',
  }, {
    title: 'Uploader un extrait de l\'office des poursuites',
    duration: '10 min',
  }, {
    title: 'Constituer une police d\'assurance',
    duration: '1 h',
  }, {
    title: 'Demander à votre notaire de remettre la cédule hypothécaire',
    duration: '2 min',
  },
];


export default class Step5Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: [0, 0, 0, 0, 0],
      arrayLength: todoCards.length,
    };
  }


  componentDidMount() {
    DocHead.setTitle('Étape 5 - e-Potek');
  }


  render() {
    return (
      <section>
        <div
          className="text-center"
          id="todo-text-top"
        >
          Appuyez sur une carte incomplète pour avancer
        </div>
        <hr id="todo-hr-top" />
        {todoCards.map((card, index) =>
          (<TodoCard
            // creditRequest={this.props.creditRequest}
            title={card.title}
            duration={card.duration}
            completionPercentage={this.state.progress[index]}
            cardId={`5-${index + 1}`}
            key={index}
            center={index === (this.state.arrayLength - 1)} // If this is the last card
          />)
        )}
      </section>
    );
  }
}

Step5Page.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
