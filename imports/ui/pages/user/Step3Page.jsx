import React, { PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import TodoCardArray from '/imports/ui/components/general/TodoCardArray.jsx';


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
      <div>
        <h1 className="stepTitle">3ème Étape <small>Montez votre dossier complet</small></h1>
        <TodoCardArray
          cards={todoCards}
          progress={this.state.progress}
        />
      </div>
    );
  }
}

Step3Page.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
