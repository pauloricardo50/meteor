import React from 'react';
import { Meteor } from 'meteor/meteor';
import { incrementStep } from '/imports/api/creditrequests/methods.js';

import TodoCard from '/imports/ui/components/general/TodoCard.jsx';


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
  }, {
    title: 'Analyse de votre demande de financement en cours..',
    duration: '48 h',
    completionPercentage: 0,
    right: false,
  }, {
    title: 'Mon bien immobilier',
    duration: '10 min',
    completionPercentage: 0,
    right: true,
  }, {
    title: 'Mon amortissement et ma stratégie de taux',
    duration: '15 min',
    completionPercentage: 0,
    right: true,
  }, {
    title: 'Mes informations personelles',
    duration: '10 min',
    completionPercentage: 0,
    right: true,
  }, {
    title: 'Mes informations économiques',
    duration: '10 min',
    completionPercentage: 0,
    right: true,
  }, {
    title: 'Obtention de votre contrat de crédit en cours..',
    duration: '7 jours',
    completionPercentage: 0,
    right: false,
  }, {
    title: 'Remplir les conditions de mise à disposition des fonds',
    duration: '2 h',
    completionPercentage: 0,
    right: true,
  }, {
    title: 'Mise à disposition des fonds',
    duration: <span className="fa fa-thumbs-o-up" />,
    completionPercentage: 0,
    right: true,
  },
];

// Indicates which cards to display for any given step
const steps = [4, 5, 9, 10, 13];

export default class TodoPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
    this.increaseStep = this.increaseStep.bind(this);
    this.setProgress = this.setProgress.bind(this);
    this.previousStepsFinished = this.previousStepsFinished.bind(this);
  }

// TODO: remove this, progress should come from the database
  setProgress(i, newPercent) {
    this.setState({
      progress: this.state.progress.map(
        (currentPercent, index3) => ((index3 === i) ? newPercent : currentPercent)
      ),
    });
  }


  previousStepsFinished() {
    for (var i = 0; i < steps[this.props.creditRequest.step]; i++) {
      if (this.state.progress[i] !== 100) {
        return '';
      }
    }
    Meteor.defer(function () {
      const h = document.getElementById('incrementButton').offsetTop + 50;
      window.scrollTo(0, h);
    });
    return (
      <div className="col-xs-12 form-group text-center animated pulse infinite" id="incrementButton" style={{ padding: '40' }}>
        <button className="btn btn-success btn-lg" onClick={this.increaseStep}>Prochaine Étape!</button>
      </div>);
  }


  increaseStep() {
    incrementStep.call({
      id: this.props.creditRequest._id,
    }, (err, res) => {
      if (err) {
        console.log(err);
      }
      // Do something with result
    });
  }

  render() {
    const currentStep = this.props.creditRequest.step;

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div
          className="text-center"
          id="todo-text-top"
        >
          Appuyez sur une carte incomplète pour avancer
        </div>
        <hr id="todo-hr-top" />
        {todoCards.slice(0, steps[currentStep]).map((card, index) =>
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
        {this.previousStepsFinished()}
      </div>
    );
  }
}

TodoPage.propTypes = {
  creditRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
