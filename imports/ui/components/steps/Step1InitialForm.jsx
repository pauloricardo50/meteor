import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import AutoForm from '../forms/AutoForm.jsx';


var savingTimeout;

export default class Step1InitialForm extends Component {
  componentWillUnmount() {
    Meteor.clearTimeout(savingTimeout);
  }


  render() {
    const formArray = [
      {
        type: 'RadioInput',
        label: 'Style de Propriété',
        radioLabels: ['Villa', 'Appartement'],
        values: ['villa', 'flat'],
        id: 'property.style',
        currentValue: this.props.loanRequest.property.style,
      }, {
        type: 'TextInputNumber',
        label: <span>Surface du terrain en m<sup>2</sup></span>,
        placeholder: '200',
        id: 'property.landArea',
        currentValue: this.props.loanRequest.property.landArea,
        showCondition: (this.props.loanRequest.property.style === 'villa'),
      }, {
        type: 'TextInputNumber',
        label: <span>Surface habitable en m<sup>2</sup></span>,
        placeholder: '120',
        id: 'property.insideArea',
        currentValue: this.props.loanRequest.property.insideArea,
      },
    ];

    return (
      <div>
        <AutoForm
          inputs={formArray}
          formClasses="col-sm-10 col-sm-offset-1"
          loanRequest={this.props.loanRequest}
        />
      </div>
    );
  }
}

Step1InitialForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
