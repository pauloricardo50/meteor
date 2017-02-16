import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';


import AutoForm from '../forms/AutoForm.jsx';
import BorrowerCountSwitch from '/imports/ui/components/general/BorrowerCountSwitch.jsx';

var savingTimeout;

const styles = {
  switchDiv: {
    display: 'flex',
    justifyContent: 'center',
  },
};

export default class Step3PersonalForm extends Component {
  constructor(props) {
    super(props);

    this.getBorrowerFormArray = this.getBorrowerFormArray.bind(this);
    this.getFinalFormArray = this.getFinalFormArray.bind(this);
  }

  componentWillUnmount() {
    Meteor.clearTimeout(savingTimeout);
  }

  getBorrowerFormArray(index) {
    const r = this.props.loanRequest;

    return [
      {
        type: 'h2',
        text: r.borrowers[index].firstName || `Emprunteur ${index + 1}`,
        showCondition: r.borrowers.length > 1,
      }, {
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
        autocomplete: 'given-name',
        id: `borrowers.${index}.firstName`,
        currentValue: r.borrowers[index].firstName,
      }, {
        type: 'TextInput',
        label: 'Nom',
        placeholder: '',
        autocomplete: 'family-name',
        id: `borrowers.${index}.lastName`,
        currentValue: r.borrowers[index].lastName,
      }, {
        type: 'TextInput',
        label: 'Adresse 1',
        placeholder: 'Rue du Parc 1',
        autocomplete: 'address-line1',
        id: `borrowers.${index}.address1`,
        currentValue: r.borrowers[index].address1,
        showCondition: (index === 0) || (index === 1 && !r.general.borrowersHaveSameAddress),
      }, {
        type: 'TextInput',
        label: 'Adresse 2',
        placeholder: 'Rue du Parc 1',
        autocomplete: 'address-line2',
        id: `borrowers.${index}.address2`,
        currentValue: r.borrowers[index].address2,
        showCondition: (index === 0) || (index === 1 && !r.general.borrowersHaveSameAddress),
      }, {
        type: 'TextInputNumber',
        label: 'Code Postal',
        placeholder: '1200',
        autocomplete: 'postal-code',
        id: `borrowers.${index}.zipCode`,
        currentValue: r.borrowers[index].zipCode,
        showCondition: (index === 0) || (index === 1 && !r.general.borrowersHaveSameAddress),
      }, {
        type: 'TextInput',
        label: 'Localité',
        placeholder: 'Genève',
        autocomplete: 'address-level2',
        id: `borrowers.${index}.city`,
        currentValue: r.borrowers[index].city,
        showCondition: (index === 0) || (index === 1 && !r.general.borrowersHaveSameAddress),
      }, {
        type: 'TextInput',
        label: 'Nationalité(s)',
        placeholder: 'Suisse, Français',
        id: `borrowers.${index}.citizenships`,
        currentValue: r.borrowers[index].citizenships,
      }, {
        type: 'TextInput',
        label: 'Permis de séjour',
        placeholder: 'Permis C',
        id: `borrowers.${index}.residencyPermit`,
        currentValue: r.borrowers[index].residencyPermit,
        info: 'Si vous n\'êtes pas Suisse',
      }, {
        type: 'DateInput',
        label: 'Date de Naissance',
        id: `borrowers.${index}.birthDate`,
        currentValue: r.borrowers[index].birthDate,
        maxDate: (function () {
          const maxDate = moment().utc();
          maxDate.subtract(18, 'years');
          // maxDate.startOf('day');
          return maxDate.toDate();
        }()),
      }, {
        type: 'TextInput',
        label: 'Lieu de Naissance',
        placeholder: 'Lausanne, Suisse',
        id: `borrowers.${index}.birthPlace`,
        currentValue: r.borrowers[index].birthPlace,
      }, {
        type: 'RadioInput',
        label: 'État civil',
        radioLabels: r.borrowers[index].gender === 'f' ?
          ['Mariée', 'Pacsée', 'Célibataire', 'Divorcée'] :
          ['Marié', 'Pacsé', 'Célibataire', 'Divorcé'],
        values: ['married', 'pacsed', 'single', 'divorced'],
        id: `borrowers.${index}.civilStatus`,
        currentValue: r.borrowers[index].civilStatus,
      }, {
        type: 'TextInput',
        label: 'Employeur',
        placeholder: 'Google',
        autocomplete: 'organization',
        id: `borrowers.${index}.company`,
        currentValue: r.borrowers[index].company,
      },
    ];
  }

  getFinalFormArray() {
    const r = this.props.loanRequest;

    return [
      {
        type: 'Space',
        height: 40,
      }, {
        type: 'ConditionalInput',
        conditionalTrueValue: 'other',
        showCondition: (r.borrowers.length > 1) &&
          (r.general.purchaseType === 'refinancing'),
        inputs: [
          {
            type: 'RadioInput',
            label: 'Qui est le propriétaire actuel?',
            radioLabels: [
              r.borrowers[0].firstName || 'Emprunteur 1',
              (r.borrowers[1] && r.borrowers[1].firstName) || 'Emprunteur 2',
              'Les Deux',
              'Autre',
            ],
            values: ['0', '1', 'both', 'other'],
            id: 'general.currentOwner',
            currentValue: r.general.currentOwner,
          }, {
            type: 'TextInput',
            label: 'Autre propriétaire',
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
              r.borrowers[0].firstName || 'Emprunteur 1',
              (r.borrowers[1] && r.borrowers[1].firstName) || 'Emprunteur 2',
              'Les Deux',
              'Autre',
            ],
            values: ['0', '1', 'both', 'other'],
            id: 'general.futureOwner',
            currentValue: r.general.futureOwner,
          }, {
            type: 'TextInput',
            label: 'Autre propriétaire',
            placeholder: '',
            id: 'general.otherOwner',
            currentValue: r.general.otherOwner,
          },
        ],
      },
    ];
  }


  render() {
    return (
      <section className="mask1">
        <h1>{this.props.loanRequest.borrowers.length > 1 ?
          'Nos informations personelles'
          :
            'Mes informations personelles'
        }</h1>

        <div style={styles.switchDiv}>
          <BorrowerCountSwitch loanRequest={this.props.loanRequest} />
        </div>

        <AutoForm
          inputs={this.getBorrowerFormArray(0)}
          formClasses={this.props.loanRequest.borrowers.length > 1 ? 'col-sm-5'
          : 'col-sm-10 col-sm-offset-1'}
          loanRequest={this.props.loanRequest}
        />
        {this.props.loanRequest.borrowers.length > 1 &&
          <AutoForm
            inputs={this.getBorrowerFormArray(1)}
            formClasses="col-sm-offset-2 col-sm-5"
            loanRequest={this.props.loanRequest}
          />
        }

        <AutoForm
          inputs={this.getFinalFormArray()}
          formClasses="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3"
          loanRequest={this.props.loanRequest}
        />
      </section>
    );
  }
}

Step3PersonalForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
