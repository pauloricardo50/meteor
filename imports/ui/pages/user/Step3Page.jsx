import React, { PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import TodoCard from '/imports/ui/components/general/TodoCard.jsx';


const todoCards = [
  {
    title: 'Mon bien immobilier',
    duration: '15 min',
  }, {
    title: 'Mes informations personelles',
    duration: '12 min',
  }, {
    title: 'Mes informations économiques',
    duration: '10 min',
  },
];


export default class Step3Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: [0, 0, 0],
      arrayLength: todoCards.length,
    };
  }

  componentDidMount() {
    DocHead.setTitle('Étape 3 - e-Potek');
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
            title={card.title}
            duration={card.duration}
            completionPercentage={this.state.progress[index]}
            cardId={`3-${index + 1}`}
            key={index}
            center={index === (this.state.arrayLength - 1)} // If this is the last card
          />)
        )}
      </section>
    );
  }
}

Step3Page.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
