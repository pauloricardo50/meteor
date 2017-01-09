import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import AutoForm from '../forms/AutoForm.jsx';


var savingTimeout;

export default class Step1InitialForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      saved: false,
      errors: '',
      savingTimeout: null,
    };

    this.changeSaving = this.changeSaving.bind(this);
    this.changeErrors = this.changeErrors.bind(this);
  }


  componentWillUnmount() {
    Meteor.clearTimeout(savingTimeout);
  }


  changeSaving(value) {
    // If the value is false, wait for half a second before changing state,
    // so that the saving appears smoothly to the user
    Meteor.clearTimeout(savingTimeout);
    var that = this;
    savingTimeout = Meteor.setTimeout(function () {
      that.setState({
        saving: value,
        saved: true,
      });
    }, (value ? 0 : 500));
  }


  // TODO: Allow multiple errors via push, and maintain current errors
  // Currently, it replaces all current errors with the new value
  changeErrors(value) {
    this.setState({
      errors: value,
    });
  }


  render() {
    const formArray = [
      {
        type: 'RadioInput',
        label: 'Style de Propriété?',
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
        {/* Show "Currently Saving" when saving,
          and show "Saved" if currently saving has already appeared once */}
        {this.state.saving ?
          <p className="secondary bold">Sauvegarde en cours...</p> :
          (this.state.saved && <p>Sauvegardé</p>)
        }
        {<h5>{this.state.errors}</h5>}
        <AutoForm
          inputs={formArray}
          formClasses="col-sm-10 col-sm-offset-1"
          loanRequest={this.props.loanRequest}
          changeSaving={this.changeSaving}
          changeErrors={this.changeErrors}
        />
      </div>
    );
  }
}

Step1InitialForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
