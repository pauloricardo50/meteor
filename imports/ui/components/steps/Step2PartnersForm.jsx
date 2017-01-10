import React, { Component, PropTypes } from 'react';

import AutoForm from '../forms/AutoForm.jsx';


export default class Step2PartnersForm extends Component {
  constructor(props) {
    super(props);

    this.getFormArray = this.getFormArray.bind(this);
  }

  getFormArray() {
    const r = this.props.loanRequest;

    return [
      {
        type: 'Subtitle',
        text: 'Mes partenaires financiers particuliers',
      }, {
        type: 'TextInput',
        label: 'Banque personelle',
        placeholder: '',
        id: 'borrowers.0.personalBank',
        currentValue: r.borrowers[0].personalBank,
        info: 'Nous la contacterons pour vous',
      }, {
        type: 'ConditionalInput',
        conditionalTrueValue: true,
        inputs: [
          {
            type: 'RadioInput',
            label: 'Avez-vous une banque préférentielle?',
            radioLabels: ['Oui', 'Non'],
            values: [true, false],
            id: 'borrowers.0.corporateBankExists',
            currentValue: r.borrowers[0].corporateBankExists,
          }, {
            type: 'TextInput',
            label: 'Banque préférentielle',
            placeholder: '',
            id: 'borrowers.0.corporateBank',
            currentValue: r.borrowers[0].corporateBank,
          },
        ],
      }, {
        type: 'ConditionalInput',
        conditionalTrueValue: true,
        inputs: [
          {
            type: 'RadioInput',
            label: 'Y-a-t\'il un établissement financier que nous devons éviter?',
            radioLabels: ['Oui', 'Non'],
            values: [true, false],
            id: 'general.partnersToAvoidExists',
            currentValue: r.general.partnersToAvoidExists,
          }, {
            type: 'TextInput',
            label: 'Lequel?',
            placeholder: 'UBS',
            id: 'general.partnersToAvoid.0',
            currentValue: r.general.partnersToAvoid[0],
          },
        ],
      },
    ];
  }

  render() {
    return (
      <AutoForm
        inputs={this.getFormArray()}
        formClasses="col-sm-offset-3 col-sm-6"
        loanRequest={this.props.loanRequest}
      />
    );
  }
}

Step2PartnersForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
