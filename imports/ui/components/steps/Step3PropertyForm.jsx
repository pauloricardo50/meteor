import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import AutoForm from '../forms/AutoForm.jsx';


var savingTimeout;

export default class Step3PropertyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      saved: false,
      errors: '',
    };

    const r = this.props.creditRequest;
    this.formArray = [
      {
        type: 'Subtitle',
        text: 'Adresse du bien immobilier',
      }, {
        type: 'TextInput',
        label: 'Adresse',
        placeholder: 'Rue des Champs 7',
        id: 'requestName',
        currentValue: r.requestName,
      }, {
        type: 'TextInputNumber',
        label: 'Code Postal',
        placeholder: '1200',
        id: 'propertyInfo.zipCode',
        currentValue: r.propertyInfo.zipCode,
      }, {
        type: 'TextInput',
        label: 'Localité',
        placeholder: 'Genève',
        id: 'propertyInfo.city',
        currentValue: r.propertyInfo.city,
      }, {
        type: 'Subtitle',
        text: 'Détails du bien',
      }, {
        type: 'TextInputNumber',
        label: 'Nb. de chambres',
        placeholder: '3.5',
        id: 'propertyInfo.roomCount',
        currentValue: r.propertyInfo.roomCount,
        info: 'Chambres à coucher',
      }, {
        type: 'TextInputNumber',
        label: 'Nb. de salles de bain',
        placeholder: '1',
        id: 'propertyInfo.bathroomCount',
        currentValue: r.propertyInfo.bathroomCount,
        info: 'Salles de bains ou salles d’eau (respectivement avec baignoire ou douche)',
      }, {
        type: 'TextInputNumber',
        label: 'Nb. de WC',
        placeholder: '1',
        id: 'propertyInfo.toiletCount',
        currentValue: r.propertyInfo.toiletCount,
      }, {
        type: 'TextInputNumber',
        label: <span>Surface du terrain en m<sup>2</sup></span>,
        placeholder: '250',
        id: 'propertyInfo.surfaceTotal',
        currentValue: r.propertyInfo.surfaceTotal,
        showCondition: (r.propertyInfo.style === 'villa'),
      }, {
        type: 'TextInputNumber',
        label: <span>Surface habitable en m<sup>2</sup></span>,
        placeholder: '150',
        id: 'propertyInfo.surface',
        currentValue: r.propertyInfo.surface,
      }, {
        type: 'TextInputNumber',
        label: <span>Volume/Cubage en m<sup>3</sup></span>,
        placeholder: '1000',
        id: 'propertyInfo.volume',
        currentValue: r.propertyInfo.volume,
      }, {
        type: 'TextInputNumber',
        label: 'Places de parc intérieur',
        placeholder: '1',
        id: 'propertyInfo.insideParking',
        currentValue: r.propertyInfo.insideParking,
      }, {
        type: 'TextInputNumber',
        label: 'Places de parc extérieur couvertes',
        placeholder: '1',
        id: 'propertyInfo.outsideParkingCovered',
        currentValue: r.propertyInfo.outsideParkingCovered,
      }, {
        type: 'TextInputNumber',
        label: 'Places de parc extérieur non-couvertes',
        placeholder: '1',
        id: 'propertyInfo.outsideParkingNotCovered',
        currentValue: r.propertyInfo.outsideParkingNotCovered,
      }, {
        type: 'TextInputNumber',
        label: 'Box de parking',
        placeholder: '1',
        id: 'propertyInfo.parkingBoxes',
        currentValue: r.propertyInfo.parkingBoxes,
      }, {
        type: 'RadioInput',
        label: 'Est-ce une construction Minergie?',
        radioLabels: ['Oui', 'Non'],
        values: ['true', 'false'],
        id: 'propertyInfo.minergie',
        currentValue: r.propertyInfo.minergie,
      }, {
        type: 'TextInputLarge',
        label: 'Autres informations',
        placeholder: 'Aménagements extérieurs, piscine, jardins, cabanons, annexes, sous-sols utiles,...',
        id: 'propertyInfo.otherInfo',
        currentValue: r.propertyInfo.otherInfo,
        rows: 3,
      },
    ];

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
    return (
      <section className="mask1">
        <h1>{this.props.creditRequest.personalInfo.twoBuyers === 'true' ?
          'Notre bien immobilier'
          :
            'Mon bien immobilier'
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

Step3PropertyForm.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
