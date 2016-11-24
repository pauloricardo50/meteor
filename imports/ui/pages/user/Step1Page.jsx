import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { DocHead } from 'meteor/kadira:dochead';
import { updateValues } from '/imports/api/creditrequests/methods.js';

import TodoCardArray from '/imports/ui/components/general/TodoCardArray.jsx';


const todoCards = [
  {
    title: 'Check-up initial',
    duration: '5 min',
  }, {
    title: 'Mes Partenaires Financiers Particuliers',
    duration: '20 sec',
  }, {
    title: 'Ma déclaration d\'impôts',
    duration: '5 sec',
  }, {
    title: 'Évaluer mon bien immobilier',
    duration: '2 min',
  },
];


export default class Step1Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: this.getPercentages(),
    };
  }

  componentDidMount() {
    DocHead.setTitle('Étape 1 - e-Potek');
  }


  getPercentages() {
    let part1 = 0;
    let part2 = 0;
    let part3 = 0;
    let part4 = 0;
    const r = this.props.creditRequest;

    // all values from the forms
    const part1Values = [
      r.personalInfo.twoBuyers, r.personalInfo.age2, r.personalInfo.age1, r.propertyInfo.type,
      r.financialInfo.salary, r.financialInfo.bonusExists, r.financialInfo.fortune,
      r.financialInfo.insuranceFortune, r.propertyInfo.value,
    ];
    const part2Values = [
      r.financialInfo.personalBank, r.financialInfo.corporateBankExists,
      r.financialInfo.corporateBank, r.financialInfo.avoidLenderExists, r.financialInfo.avoidLender,
    ];

    let length1 = part1Values.length;
    let length2 = part2Values.length;

    if (r.personalInfo.twoBuyers === 'false') { length1 -= 1; } // Don't count age2
    if (r.personalInfo.bonusExists === 'false') { length1 -= 1; } // Don't count bonus
    if (r.financialInfo.corporateBankExists === 'false') { length2 -= 1; } // Don't count corporate bank
    if (r.financialInfo.avoidLenderExists === 'false') { length2 -= 1; } // Don't count avoided lender


    if (r.files.taxes) {
      if (r.files.taxes.url) { part3 = 100; }

    }
    if (r.files.housePicture) {
      if (r.files.housePicture.url) { part4 = 100; }

    }
    // if (r.files.taxes.url) { part3 = 100; }
    // if (r.files.housePicture.url) { part4 = 100; }


    // Filter out values
    part1 = Math.round((part1Values.filter(this.filterFunc).length / length1) * 100);
    part2 = Math.round((part2Values.filter(this.filterFunc).length / length2) * 100);

    if (part1 >= 100 && part2 >= 100 && part3 >= 100 && part4 >= 100) {
      this.setStepTo2();
    }

    return [
      Math.min(part1, 100),
      Math.min(part2, 100),
      Math.min(part3, 100),
      Math.min(part4, 100),
    ];
  }


  setStepTo2() {
    const id = this.props.creditRequest._id;
    const object = {};
    object['logic.step'] = 1;

    updateValues.call({
      object, id,
    }, (error, result) => {
      if (error) {
        console.log(error.message);
        throw new Meteor.Error(500, error.message);
      } else {
        return 'Step Increment Successful';
      }
    });
  }


  // Only return true for values which aren't equal an empty string
  filterFunc(value) {
    return value !== '' && value !== undefined && value !== null;
  }


  render() {
    return (
      <div>
        <h1 className="stepTitle">1ère Étape <small>Préparez-vous pour les enchères</small></h1>
        <TodoCardArray
          cards={todoCards}
          progress={this.state.progress}
        />
      </div>
    );
  }
}

Step1Page.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
