import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import AutoForm from '../forms/AutoForm.jsx';


var savingTimeout;

export default class Step3PropertyForm extends Component {
  constructor(props) {
    super(props);

    this.getFormArray = this.getFormArray.bind(this);
  }

  componentWillUnmount() {
    Meteor.clearTimeout(savingTimeout);
  }

  getFormArray() {
    const r = this.props.loanRequest;

    return [
      {
        type: 'Subtitle',
        text: 'Adresse du bien immobilier',
      }, {
        type: 'TextInput',
        label: 'Adresse 1',
        placeholder: 'Rue des Champs 7',
        id: 'property.address1',
        currentValue: r.property.address1,
      }, {
        type: 'TextInput',
        label: 'Adresse 2',
        placeholder: '',
        id: 'property.address2',
        currentValue: r.property.address2,
      }, {
        type: 'TextInputNumber',
        label: 'Code Postal',
        placeholder: '1200',
        id: 'property.zipCode',
        currentValue: r.property.zipCode,
      }, {
        type: 'TextInput',
        label: 'Localité',
        placeholder: 'Genève',
        id: 'property.city',
        currentValue: r.property.city,
      }, {
        type: 'Subtitle',
        text: 'Détails du bien',
      }, {
        type: 'TextInputNumber',
        label: 'Nb. de chambres',
        placeholder: '3.5',
        id: 'property.roomCount',
        currentValue: r.property.roomCount,
        info: 'Chambres à coucher',
      }, {
        type: 'TextInputNumber',
        label: 'Nb. de salles de bain',
        placeholder: '1',
        id: 'property.bathroomCount',
        currentValue: r.property.bathroomCount,
        info: 'Salles de bains ou salles d’eau (respectivement avec baignoire ou douche)',
      }, {
        type: 'TextInputNumber',
        label: 'Nb. de WC',
        placeholder: '1',
        id: 'property.toiletCount',
        currentValue: r.property.toiletCount,
      }, {
        type: 'TextInputNumber',
        label: <span>Surface du terrain en m<sup>2</sup></span>,
        placeholder: '250',
        id: 'property.landArea',
        currentValue: r.property.landArea,
        showCondition: (r.property.style === 'villa'),
      }, {
        type: 'TextInputNumber',
        label: <span>Surface habitable en m<sup>2</sup></span>,
        placeholder: '150',
        id: 'property.insideArea',
        currentValue: r.property.insideArea,
      }, {
        type: 'TextInputNumber',
        label: <span>Volume/Cubage en m<sup>3</sup></span>,
        placeholder: '1000',
        id: 'property.volume',
        currentValue: r.property.volume,
      }, {
        type: 'TextInputNumber',
        label: 'Places de parc intérieur',
        placeholder: '1',
        id: 'property.parking.inside',
        currentValue: r.property.parking.inside,
      }, {
        type: 'TextInputNumber',
        label: 'Box de parking',
        placeholder: '1',
        id: 'property.parking.box',
        currentValue: r.property.parking.box,
      }, {
        type: 'TextInputNumber',
        label: 'Places de parc extérieur couvertes',
        placeholder: '1',
        id: 'property.parking.outsideCovered',
        currentValue: r.property.parking.outsideCovered,
      }, {
        type: 'TextInputNumber',
        label: 'Places de parc extérieur non-couvertes',
        placeholder: '1',
        id: 'property.parking.outsideNotCovered',
        currentValue: r.property.parking.outsideNotCovered,
      }, {
        type: 'RadioInput',
        label: 'Est-ce une construction Minergie?',
        radioLabels: ['Oui', 'Non'],
        values: [true, false],
        id: 'property.minergie',
        currentValue: r.property.minergie,
      }, {
        type: 'TextInputLarge',
        label: 'Autres informations',
        placeholder: 'Aménagements extérieurs, piscine, jardins, cabanons, annexes, sous-sols utiles,...',
        id: 'property.other',
        currentValue: r.property.other,
        rows: 3,
      },
    ];
  }


  render() {
    return (
      <section className="mask1">
        <h1>{this.props.loanRequest.borrowers.length > 1 ?
          'Notre bien immobilier'
          :
            'Mon bien immobilier'
        }</h1>

        <AutoForm
          inputs={this.getFormArray()}
          formClasses="col-sm-10 col-sm-offset-1"
          loanRequest={this.props.loanRequest}
        />
      </section>
    );
  }
}

Step3PropertyForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
