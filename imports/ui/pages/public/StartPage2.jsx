import React, { Component, PropTypes } from 'react';

import AutoStart from '/imports/ui/components/forms/AutoStart.jsx';

const styles = {
  buttons: {
    marginLeft: 8,
    marginRight: 8,
  },
  extra: {
    marginBottom: 16,
  },
};

const findValue = function (id) {
  return this.find(x => x.id === id).value;
};


export default class StartPage2 extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.changeState = this.changeState.bind(this);
    this.getFormArray = this.getFormArray.bind(this);
  }


  changeState(id, value) {
    const object = {};
    object[id] = value;

    console.log(object);

    this.setState(object);
  }


  getFormArray() {
    const s = this.state;
    return [
      {
        id: 'purchaseType',
        type: 'buttons',
        label: 'Type de prêt',
        answers: [
          'acquisition',
          'refinancing',
          'liquidity',
        ],
        value: '',
        show: () => true,
      }, {
        id: 'knowProperty',
        type: 'buttons',
        label: 'Avez-vous identifié le bien immobilier?',
        answers: [
          'yes',
          'no',
        ],
        show: () => s.purchaseType === 'acquisition',
      }, {
        id: 'propertyValue',
        type: 'textInput',
        label: 'Prix d\'achat du bien',
        show: () => s.knowProperty === 'yes',
      }, {
        id: 'propertyValue',
        type: 'textInput',
        label: 'Le prêt est actuellement au près de',
        show: () => s.purchaseType === 'refinancing',
      },
    ];
  }


  render() {
    return (
      <AutoStart
        formArray={this.getFormArray()}
        changeState={this.changeState}
      />
    );
  }
}

StartPage2.propTypes = {
};
