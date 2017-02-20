import React, { PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import TodoCardArray from '/imports/ui/components/general/TodoCardArray.jsx';


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
      <div>
        <h1>5ème Étape <small>Dernières démarches administratives</small></h1>
        <TodoCardArray
          cards={todoCards}
          progress={this.state.progress}
        />
      </div>
    );
  }
}

Step5Page.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
