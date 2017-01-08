import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import moment from 'moment';

import AutoForm from '../forms/AutoForm.jsx';


var savingTimeout;

export default class Step3PersonalForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      saved: false,
      errors: '',
      sameAddress: false,
    };

    this.changeSaving = this.changeSaving.bind(this);
    this.changeErrors = this.changeErrors.bind(this);
    this.getInitialFormArray = this.getInitialFormArray.bind(this);
    this.getBorrowerFormArray = this.getBorrowerFormArray.bind(this);
    this.getFinalFormArray = this.getFinalFormArray.bind(this);
    this.setFormArray = this.setFormArray.bind(this);
  }

  componentWillUnmount() {
    Meteor.clearTimeout(savingTimeout);
  }

  getInitialFormArray() {
    return [
      {
        type: 'RadioInput',
        label: 'Nb. d\'emprunteurs',
        radioLabels: ['1', '2'],
        values: ['false', 'true'],
        id: 'personalInfo.twoBuyers',
        currentValue: this.props.creditRequest.personalInfo.twoBuyers,
      },
    ];
  }

  getBorrowerFormArray(index) {
    const rp = this.props.creditRequest.personalInfo;

    return [
      {
        type: 'RadioInput',
        label: 'Genre',
        radioLabels: ['Monsieur', 'Madame'],
        values: ['m', 'f'],
        id: `personalInfo.borrowers.${index}.gender`,
        currentValue: rp.borrowers[index].gender,
      }, {
        type: 'TextInput',
        label: 'Prénom',
        placeholder: '',
        id: `personalInfo.borrowers.${index}.firstName`,
        currentValue: rp.borrowers[index].firstName,
      }, {
        type: 'TextInput',
        label: 'Nom',
        placeholder: '',
        id: `personalInfo.borrowers.${index}.lastName`,
        currentValue: rp.borrowers[index].lastName,
      }, {
        type: 'TextInput',
        label: 'Adresse',
        placeholder: 'Rue du Parc 1',
        id: `personalInfo.borrowers.${index}.address`,
        currentValue: rp.borrowers[index].address,
        showCondition: (index === 1) && rp.sameAddress,
      }, {
        type: 'TextInputNumber',
        label: 'Code Postal',
        placeholder: '1200',
        id: `personalInfo.borrowers.${index}.zipCode`,
        currentValue: rp.borrowers[index].zipCode,
        showCondition: (index === 1) && rp.sameAddress,
      }, {
        type: 'TextInput',
        label: 'Localité',
        placeholder: 'Genève',
        id: `personalInfo.borrowers.${index}.city`,
        currentValue: rp.borrowers[index].city,
        showCondition: (index === 1) && rp.sameAddress,
      }, {
        type: 'TextInput',
        label: 'Nationalité(s)',
        placeholder: 'Suisse, Français',
        id: `personalInfo.borrowers.${index}.citizenships`,
        currentValue: rp.borrowers[index].citizenships,
      }, {
        type: 'TextInput',
        label: 'Permis d\'établissement (si pas Suisse)',
        placeholder: 'Permis C',
        id: `personalInfo.borrowers.${index}.residencyPermit`,
        currentValue: rp.borrowers[index].residencyPermit,
      }, {
        type: 'DateInput',
        label: 'Date de Naissance',
        id: `personalInfo.borrowers.${index}.birthDate`,
        currentValue: rp.borrowers[index].birthDate,
        maxDate: (function () {
          const maxDate = new Date();
          maxDate.setFullYear(maxDate.getFullYear() - 18);
          maxDate.setHours(0, 0, 0, 0);
          return maxDate;
        }()),
      }, {
        type: 'TextInput',
        label: 'Lieu de Naissane, Pays de Naissance',
        placeholder: 'Berne, Suisse',
        id: `personalInfo.borrowers.${index}.birthPlace`,
        currentValue: rp.borrowers[index].birthPlace,
      }, {
        type: 'RadioInput',
        label: 'État civil',
        radioLabels: ['Marié', 'Pacsé', 'Célibataire', 'Divorcé'],
        values: ['married', 'pacsed', 'single', 'divorced'],
        id: `personalInfo.borrowers.${index}.civilStatus`,
        currentValue: rp.borrowers[index].civilStatus,
      }, {
        type: 'TextInput',
        label: 'Employeur',
        placeholder: 'e-Potek',
        id: `personalInfo.borrowers.${index}.company`,
        currentValue: rp.borrowers[index].company,
      }, {
        type: 'TextInputMoney',
        label: 'Revenus bruts annuels',
        placeholder: '',
        id: `personalInfo.borrowers.${index}.grossIncome`,
        currentValue: rp.borrowers[index].grossIncome,
      }, {
        type: 'TextInputMoney',
        label: 'Autres revenus',
        placeholder: '',
        id: `personalInfo.borrowers.${index}.otherIncome`,
        currentValue: rp.borrowers[index].otherIncome,
      },
    ];
  }

  getFinalFormArray() {
    const r = this.props.creditRequest;

    return [
      {
        type: 'ConditionalInput',
        conditionalTrueValue: 'other',
        showCondition: (r.personalInfo.twoBuyers === 'true') &&
          (r.propertyInfo.purchaseType === 'refinancing'),
        inputs: [
          {
            type: 'RadioInput',
            label: 'Qui est le propriétaire actuel?',
            radioLabels: [
              r.personalInfo.borrowers[0].firstName ? r.personalInfo.borrowers[0].firstName : 'Emprunteur 1',
              r.personalInfo.borrowers[1].firstName ? r.personalInfo.borrowers[1].firstName : 'Emprunteur 2',
              'Les Deux',
              'Autre',
            ],
            values: ['0', '1', 'both', 'other'],
            id: 'personalInfo.currentOwner',
            currentValue: r.personalInfo.currentOwner,
          }, {
            type: 'TextInput',
            label: 'Qui?',
            placeholder: '',
            id: 'personalInfo.otherOwner',
            currentValue: r.personalInfo.otherOwner,
          },
        ],
      }, {
        type: 'ConditionalInput',
        conditionalTrueValue: 'other',
        showCondition: (r.personalInfo.twoBuyers === 'true') &&
          (r.propertyInfo.purchaseType !== 'refinancing'),
        inputs: [
          {
            type: 'RadioInput',
            label: 'Qui sera le propriétaire du bien immobilier?',
            radioLabels: [
              r.personalInfo.borrowers[0].firstName ? r.personalInfo.borrowers[0].firstName : 'Emprunteur 1',
              r.personalInfo.borrowers[1].firstName ? r.personalInfo.borrowers[1].firstName : 'Emprunteur 2',
              'Les Deux',
              'Autre',
            ],
            values: ['0', '1', 'both', 'other'],
            id: 'personalInfo.futureOwner',
            currentValue: r.personalInfo.futureOwner,
          }, {
            type: 'TextInput',
            label: 'Qui?',
            placeholder: '',
            id: 'personalInfo.otherOwner',
            currentValue: r.personalInfo.otherOwner,
          },
        ],
      },
    ];
  }


  setFormArray() {
    const newArray = this.getInitialFormArray();
    const r = this.props.creditRequest;
    if (r.personalInfo.twoBuyers === 'true') {
      newArray.push(...this.getBorrowerFormArray(0));
      newArray.push({
        type: 'RadioInput',
        label: 'Habitez-vous à la même adresse?',
        radioLabels: ['Oui', 'Non'],
        values: [true, false],
        id: 'personalInfo.sameAddress',
        currentValue: r.personalInfo.sameAddress,
      });
      newArray.push(...this.getBorrowerFormArray(1));
    } else {
      newArray.push(...this.getBorrowerFormArray(0));
    }

    newArray.push(...this.getFinalFormArray());

    return newArray;
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
    const newFormArray = this.setFormArray();

    return (
      <section className="mask1">
        <h1>{this.props.creditRequest.personalInfo.twoBuyers === 'true' ?
          'Nos informations personelles'
          :
            'Mes informations personelles'
        }</h1>

        {/* Show "Currently Saving" when saving,
          and show "Saved" if currently saving has already appeared once */}
        {this.state.saving ?
          <p className="secondary bold">Sauvegarde en cours...</p> :
          (this.state.saved && <p>Sauvegardé</p>)
        }
        {/* <h5>{this.state.errors}</h5> */}
        <AutoForm
          inputs={newFormArray}
          formClasses="col-sm-10 col-sm-offset-1"
          creditRequest={this.props.creditRequest}
          changeSaving={this.changeSaving}
          changeErrors={this.changeErrors}
        />
      </section>
    );
  }
}

Step3PersonalForm.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
