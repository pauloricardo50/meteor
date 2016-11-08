import React, { PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import TodoCard from '/imports/ui/components/general/TodoCard.jsx';


const todoCards = [
  {
    title: 'Mon bien immobilier',
    duration: '15 min',
    completionPercentage: 0,
    right: true,
  }, {
    title: 'Mes informations personelles',
    duration: '12 min',
    completionPercentage: 0,
    right: true,
  }, {
    title: 'Mes informations économiques',
    duration: '10 min',
    completionPercentage: 0,
    right: true,
  },
];


export default class Step3Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: [0, 0, 0, 0],
      arrayLength: todoCards.length,
    };
    this.setProgress = this.setProgress.bind(this);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 3 - e-Potek');
  }

// TODO: remove this, progress should come from the database
  setProgress(i, newPercent) {
    this.setState({
      progress: this.state.progress.map(
        (currentPercent, index3) => ((index3 === i) ? newPercent : currentPercent)
      ),
    });
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
            // completionPercentage={card.completionPercentage}
            completionPercentage={this.state.progress[index]}
            setProgress={this.setProgress}
            right={card.right}
            cardId={index}
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
