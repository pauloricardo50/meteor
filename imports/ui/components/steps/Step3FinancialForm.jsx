import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import AutoForm from '../forms/AutoForm.jsx';


var savingTimeout;

export default class Step3FinancialForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      saved: false,
      errors: '',
    };

    this.changeSaving = this.changeSaving.bind(this);
    this.changeErrors = this.changeErrors.bind(this);
  }

  componentWillUnmount() {
    Meteor.clearTimeout(savingTimeout);
  }

  getFinanceFormArray() {
    const r = this.props.creditRequest;

    return [
      {
        type: 'Subtitle',
        text: 'Adresse du bien immobilier',
      }, {
        type: 'TextInput',
        label: 'Adresse',
        placeholder: 'Rue des Champs 7',
        id: 'requestName',
        currentValue: r.requestName,
      },
    ];
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
    return (
      <section className="mask1">
        <h1>{this.props.creditRequest.personalInfo.twoBuyers === 'true' ?
          'Nos informations économiques'
          :
            'Mes informations économiques'
        }</h1>

        {/* Show "Currently Saving" when saving,
          and show "Saved" if currently saving has already appeared once */}
        {this.state.saving ?
          <p className="secondary bold">Sauvegarde en cours...</p> :
          (this.state.saved && <p>Sauvegardé</p>)
        }
        {/* <h5>{this.state.errors}</h5> */}
        <AutoForm
          inputs={this.formArray}
          formClasses="col-sm-10 col-sm-offset-1"
          creditRequest={this.props.creditRequest}
          changeSaving={this.changeSaving}
          changeErrors={this.changeErrors}
        />
      </section>
    );
  }
}

Step3FinancialForm.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
