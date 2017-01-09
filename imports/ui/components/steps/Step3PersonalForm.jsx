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
    this.getBorrowerFormArray = this.getBorrowerFormArray.bind(this);
    this.getFinalFormArray = this.getFinalFormArray.bind(this);
    this.setFormArray = this.setFormArray.bind(this);
  }

  componentWillUnmount() {
    Meteor.clearTimeout(savingTimeout);
  }

  getBorrowerFormArray(index) {
    const r = this.props.loanRequest;

    return [
      {
        type: 'RadioInput',
        label: 'Genre',
        radioLabels: ['Monsieur', 'Madame'],
        values: ['m', 'f'],
        id: `borrowers.${index}.gender`,
        currentValue: r.borrowers[index].gender,
      }, {
        type: 'TextInput',
        label: 'Prénom',
        placeholder: '',
        id: `borrowers.${index}.firstName`,
        currentValue: r.borrowers[index].firstName,
      }, {
        type: 'TextInput',
        label: 'Nom',
        placeholder: '',
        id: `borrowers.${index}.lastName`,
        currentValue: r.borrowers[index].lastName,
      }, {
        type: 'TextInput',
        label: 'Adresse',
        placeholder: 'Rue du Parc 1',
        id: `borrowers.${index}.address1`,
        currentValue: r.borrowers[index].address1,
        showCondition: (index === 1) && r.general.borrowersHaveSameAddress,
      }, {
        type: 'TextInput',
        label: 'Adresse',
        placeholder: 'Rue du Parc 1',
        id: `borrowers.${index}.address2`,
        currentValue: r.borrowers[index].address2,
        showCondition: (index === 1) && r.general.borrowersHaveSameAddress,
      }, {
        type: 'TextInputNumber',
        label: 'Code Postal',
        placeholder: '1200',
        id: `borrowers.${index}.zipCode`,
        currentValue: r.borrowers[index].zipCode,
        showCondition: (index === 1) && r.general.borrowersHaveSameAddress,
      }, {
        type: 'TextInput',
        label: 'Localité',
        placeholder: 'Genève',
        id: `borrowers.${index}.city`,
        currentValue: r.borrowers[index].city,
        showCondition: (index === 1) && r.general.borrowersHaveSameAddress,
      }, {
        type: 'TextInput',
        label: 'Nationalité(s)',
        placeholder: 'Suisse, Français',
        id: `borrowers.${index}.citizenships`,
        currentValue: r.borrowers[index].citizenships,
      }, {
        type: 'TextInput',
        label: 'Permis d\'établissement (si pas Suisse)',
        placeholder: 'Permis C',
        id: `borrowers.${index}.residencyPermit`,
        currentValue: r.borrowers[index].residencyPermit,
      }, {
        type: 'DateInput',
        label: 'Date de Naissance',
        id: `borrowers.${index}.birthDate`,
        currentValue: r.borrowers[index].birthDate,
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
        id: `borrowers.${index}.birthPlace`,
        currentValue: r.borrowers[index].birthPlace,
      }, {
        type: 'RadioInput',
        label: 'État civil',
        radioLabels: ['Marié', 'Pacsé', 'Célibataire', 'Divorcé'],
        values: ['married', 'pacsed', 'single', 'divorced'],
        id: `borrowers.${index}.civilStatus`,
        currentValue: r.borrowers[index].civilStatus,
      }, {
        type: 'TextInput',
        label: 'Employeur',
        placeholder: 'e-Potek',
        id: `borrowers.${index}.company`,
        currentValue: r.borrowers[index].company,
      }, {
        type: 'TextInputMoney',
        label: 'Revenus bruts annuels',
        placeholder: '',
        id: `borrowers.${index}.grossIncome`,
        currentValue: r.borrowers[index].grossIncome,
      },
      // {
      //   type: 'TextInputMoney',
      //   label: 'Autres revenus',
      //   placeholder: '',
      //   id: `personalInfo.borrowers.${index}.otherIncome`,
      //   currentValue: rp.borrowers[index].otherIncome,
      // },
    ];
  }

  getFinalFormArray() {
    const r = this.props.loanRequest;

    return [
      {
        type: 'ConditionalInput',
        conditionalTrueValue: 'other',
        showCondition: (r.borrowers.length > 1) &&
          (r.general.purchaseType === 'refinancing'),
        inputs: [
          {
            type: 'RadioInput',
            label: 'Qui est le propriétaire actuel?',
            radioLabels: [
              r.borrowers[0].firstName ? r.borrowers[0].firstName : 'Emprunteur 1',
              r.borrowers[1].firstName ? r.borrowers[1].firstName : 'Emprunteur 2',
              'Les Deux',
              'Autre',
            ],
            values: ['0', '1', 'both', 'other'],
            id: 'general.currentOwner',
            currentValue: r.general.currentOwner,
          }, {
            type: 'TextInput',
            label: 'Qui?',
            placeholder: '',
            id: 'general.otherOwner',
            currentValue: r.general.otherOwner,
          },
        ],
      }, {
        type: 'ConditionalInput',
        conditionalTrueValue: 'other',
        showCondition: (r.borrowers.length > 1) &&
          (r.general.purchaseType !== 'refinancing'),
        inputs: [
          {
            type: 'RadioInput',
            label: 'Qui sera le propriétaire du bien immobilier?',
            radioLabels: [
              r.borrowers[0].firstName ? r.borrowers[0].firstName : 'Emprunteur 1',
              r.borrowers[1].firstName ? r.borrowers[1].firstName : 'Emprunteur 2',
              'Les Deux',
              'Autre',
            ],
            values: ['0', '1', 'both', 'other'],
            id: 'general.futureOwner',
            currentValue: r.general.futureOwner,
          }, {
            type: 'TextInput',
            label: 'Qui?',
            placeholder: '',
            id: 'general.otherOwner',
            currentValue: r.general.otherOwner,
          },
        ],
      },
    ];
  }


  setFormArray() {
    const newArray = [];
    const r = this.props.loanRequest;
    if (r.borrowers.length > 1) {
      newArray.push(...this.getBorrowerFormArray(0));
      newArray.push({
        type: 'RadioInput',
        label: 'Habitez-vous à la même adresse?',
        radioLabels: ['Oui', 'Non'],
        values: [true, false],
        id: 'general.borrowersHaveSameAddress',
        currentValue: r.general.borrowersHaveSameAddress,
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
        <h1>{this.props.loanRequest.borrowers.length > 1 ?
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
          loanRequest={this.props.loanRequest}
          changeSaving={this.changeSaving}
          changeErrors={this.changeErrors}
        />
      </section>
    );
  }
}

Step3PersonalForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
