import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';


import RaisedButton from 'material-ui/RaisedButton';

import TodoCardArray from '/imports/ui/components/general/TodoCardArray.jsx';
import cleanMethod from '/imports/api/cleanMethods';


const styles = {
  continueButton: {
    float: 'right',
  },
};

export default class Step3Page extends React.Component {
  constructor(props) {
    super(props);

    const titles = this.props.loanRequest.borrowers.length > 1 ? [
      'Nos informations personelles', 'Notre bien immobilier',
      'Nos informations économiques', 'Nos documents à uploader',
    ] :
    [
      'Mes informations personelles', 'Mon bien immobilier',
      'Mes informations économiques', 'Mes documents à uploader',
    ];

    this.todoCards = [
      {
        title: titles[0],
        duration: '1 min',
        href: 'personal',
      }, {
        title: titles[1],
        duration: '2 min',
        href: 'property',
      }, {
        title: titles[2],
        duration: '5 min',
        href: 'finance',
      }, {
        title: titles[3],
        duration: '10 min',
        href: 'files',
      },
    ];

    this.state = {
      progress: [0, 0, 0, 0],
      arrayLength: this.todoCards.length,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 3 - e-Potek');
  }

  handleClick() {
    const object = {};
    object['logic.step'] = 3;
    const id = this.props.loanRequest._id;

    cleanMethod('update', id, object,
      (error) => {
        if (!error) {
          // Head to step 4
          FlowRouter.go('/step4');
        }
      });
  }


  render() {
    return (
      <div>
        <h1 className="stepTitle">3ème Étape <small>Montez votre dossier complet</small></h1>
        <TodoCardArray
          cards={this.todoCards}
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
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
