import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';


import RaisedButton from 'material-ui/RaisedButton';

import TodoCardArray from '/imports/ui/components/general/TodoCardArray.jsx';
import { updateValues } from '/imports/api/creditrequests/methods.js';


const todoCards = [
  {
    title: 'Mon bien immobilier',
    duration: '15 min',
    href: 'property',
  }, {
    title: 'Mes informations personelles',
    duration: '12 min',
    href: 'perso',
  }, {
    title: 'Mes informations économiques',
    duration: '10 min',
    href: 'finance',
  }, {
    title: 'Mes documents à uploader',
    duration: '30 min',
    href: 'files',
  },
];


const styles = {
  continueButton: {
    float: 'right',
  },
};

export default class Step3Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: [0, 0, 0, 0],
      arrayLength: todoCards.length,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 3 - e-Potek');
  }

  handleClick() {
    const object = {};
    object['logic.step'] = 3;
    const id = this.props.creditRequest._id;

    updateValues.call({
      object, id,
    }, (error, result) => {
      if (error) {
        throw new Meteor.Error(500, error.message);
      } else {
        // Head to step 2
        FlowRouter.go('/step4');
        return 'Update Successful';
      }
    });
  }


  render() {
    return (
      <div>
        <h1 className="stepTitle">3ème Étape <small>Montez votre dossier complet</small></h1>
        <TodoCardArray
          cards={todoCards}
          progress={this.state.progress}
        />
        <div className="col-xs-12">
          <RaisedButton
            label="Continuer"
            style={styles.continueButton}
            primary
            onClick={this.handleClick}
          />
        </div>
      </div>
    );
  }
}

Step3Page.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
