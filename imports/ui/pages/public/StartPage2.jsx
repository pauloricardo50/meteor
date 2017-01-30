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

    this.setState(object);
  }


  getFormArray() {
    const s = this.state;
    const array1 = [
      {
        id: 'purchaseType',
        type: 'buttons',
        label: 'Type de prêt',
        answers: [
          'acquisition',
          'refinancing',
          'liquidity',
        ],
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
        id: 'propertyValue1',
        type: 'textInput',
        label: 'Prix d\'achat du bien',
        show: () => s.knowProperty === 'yes',
      }, {
        id: 'currentBank',
        type: 'textInput',
        label: 'Le prêt est actuellement au près de',
        show: () => s.purchaseType === 'refinancing',
      }, {
        id: 'loanValue',
        type: 'textInput',
        label: 'Montant du prêt',
        show: () => !!s.currentBank,
      }, {
        id: 'refinanceValue',
        type: 'textInput',
        label: 'Montant que je souhaite refinancer',
        show: () => !!s.loanValue,
      }, {
        id: 'refinanceDate',
        type: 'textInput',
        label: 'Date à laquelle je voudrais refinancer',
        show: () => !!s.refinanceValue,
      }, {
        id: 'propertyValue2',
        type: 'textInput',
        label: 'Estimation de la valeur de mon bien',
        show: () => !!s.refinanceDate,
      },
    ];

    const array2 = [
      {
        id: 'usageType',
        type: 'buttons',
        label: 'Utilisation de la propriété',
        answers: [
          'primary',
          'secondary',
          'investment',
        ],
        show: () => !!s.propertyValue1 || s.knowProperty === 'no' || !!s.refinanceDate,
      }, {
        id: 'currentRent',
        type: 'textInput',
        label: 'Loyer estimé de la propriété par mois',
        show: () => s.usageType === 'investment',
      },
    ];

    const array3 = [
      {
        id: 'borrowerCount',
        type: 'textInput',
        label: 'Combien d\'emprunteurs?',
        show: () => s.usageType === 'primary' || s.usageType === 'secondary' || s.currentRent,
      }, {
        id: 'oldestBorrower',
        type: 'textInput',
        label: 'L\'emprunteur le plus agé a',
        show: () => !!s.borrowerCount,
      },
    ];

    const array4 = [
      {
        id: 'yearlyIncome'
      }
    ];

    return array1.concat(array2, array3);
  }

  getBorrowerFormArray(nb) {
    return [

    ];
  }


  render() {
    return (
      <AutoStart
        formArray={this.getFormArray()}
        changeState={this.changeState}
        formState={this.state}
      />
    );
  }
}

StartPage2.propTypes = {
};
