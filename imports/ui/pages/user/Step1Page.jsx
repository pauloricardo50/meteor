import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import TodoCard from '/imports/ui/components/general/TodoCard.jsx';


const styles = {
  div: {
    height: '100%',
    width: '100%',
  },
  ul: {
    padding: 0,
  },
};

const todoCards = [
  {
    title: 'Check-up initial',
    duration: '5 min',
    completionPercentage: 80,
    right: true,
  }, {
    title: 'Mes Partenaires Financiers Particuliers',
    duration: '20 sec',
    completionPercentage: 0,
    right: true,
  }, {
    title: 'Ma déclaration d\'impôts',
    duration: '5 sec',
    completionPercentage: 0,
    right: true,
  }, {
    title: 'Évaluer mon bien immobilier',
    duration: '2 min',
    completionPercentage: 0,
    right: true,
  },
];


export default class Step1Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: [100, 0, 0, 0],
    };
    this.setProgress = this.setProgress.bind(this);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 1 - e-Potek');
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
      <div style={styles.div}>
        <div
          className="text-center"
          id="todo-text-top"
        >
          Appuyez sur une carte incomplète pour avancer
        </div>
        <hr id="todo-hr-top" />
        <ul style={styles.ul}>
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
        </ul>
      </div>
    );
  }
}

Step1Page.propTypes = {
};
