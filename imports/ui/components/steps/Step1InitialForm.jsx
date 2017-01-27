import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import AutoForm from '../forms/AutoForm.jsx';


export default class Step1InitialForm extends Component {
  constructor(props) {
    super(props);

    this.getFormArray = this.getFormArray.bind(this);
  }


  getFormArray() {
    const r = this.props.loanRequest;
    return [
      {
        type: 'DropzoneInput',
        label: 'Mon contrat d\'acte d\'achat',
        id: 'general.files.buyersContract',
        message: '',
        currentValue: r.general.files.buyersContract,
        folderName: 'buyersContract',
      }, {
        type: 'RadioInput',
        label: 'Style de Propriété',
        radioLabels: ['Villa', 'Appartement'],
        values: ['villa', 'flat'],
        id: 'property.style',
        currentValue: r.property.style,
      }, {
        type: 'TextInputNumber',
        label: <span>Surface du terrain en m<sup>2</sup></span>,
        placeholder: '200',
        id: 'property.landArea',
        currentValue: r.property.landArea,
        showCondition: r.property.style === 'villa',
      }, {
        type: 'TextInputNumber',
        label: <span>Surface habitable en m<sup>2</sup></span>,
        placeholder: '120',
        id: 'property.insideArea',
        currentValue: r.property.insideArea,
      },
    ];
  }


  render() {
    return (
      <div>
        <AutoForm
          inputs={this.getFormArray()}
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
