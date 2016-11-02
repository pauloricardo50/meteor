import React, { PropTypes } from 'react';

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
    };
    this.setProgress = this.setProgress.bind(this);
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
      <div style={{ height: '100%', width: '100%' }}>
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
          />)
        )}
      </div>
    );
  }
}

Step3Page.propTypes = {
};
