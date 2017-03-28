import React from 'react';

const getPropertyArray = props => {
  const r = props.loanRequest;
  const borrowers = props.borrowers;

  return [
    {
      type: 'ConditionalInput',
      conditionalTrueValue: 'other',
      showCondition: borrowers.length > 1 &&
        r.general.purchaseType === 'refinancing',
      inputs: [
        {
          type: 'RadioInput',
          label: 'Qui est le propriétaire actuel?',
          radioLabels: [
            borrowers[0].firstName || 'Emprunteur 1',
            (borrowers[1] && borrowers[1].firstName) || 'Emprunteur 2',
            'Les Deux',
            'Autre',
          ],
          values: ['0', '1', 'both', 'other'],
          id: 'general.currentOwner',
          currentValue: r.general.currentOwner,
        },
        {
          type: 'TextInput',
          label: 'Autre propriétaire',
          placeholder: '',
          id: 'general.otherOwner',
          currentValue: r.general.otherOwner,
        },
      ],
    },
    {
      type: 'ConditionalInput',
      conditionalTrueValue: 'other',
      showCondition: borrowers.length > 1 &&
        r.general.purchaseType !== 'refinancing',
      inputs: [
        {
          type: 'RadioInput',
          label: 'Qui sera le propriétaire du bien immobilier?',
          radioLabels: [
            borrowers[0].firstName || 'Emprunteur 1',
            (borrowers[1] && borrowers[1].firstName) || 'Emprunteur 2',
            'Les Deux',
            'Autre',
          ],
          values: ['0', '1', 'both', 'other'],
          id: 'general.futureOwner',
          currentValue: r.general.futureOwner,
        },
        {
          type: 'TextInput',
          label: 'Autre propriétaire',
          placeholder: '',
          id: 'general.otherOwner',
          currentValue: r.general.otherOwner,
        },
      ],
    },
    {
      type: 'h3',
      text: 'Adresse du bien immobilier',
    },
    {
      type: 'TextInput',
      label: 'Adresse 1',
      placeholder: 'Rue des Champs 7',
      id: 'property.address1',
      currentValue: r.property.address1,
    },
    {
      type: 'TextInput',
      label: 'Adresse 2',
      placeholder: '',
      id: 'property.address2',
      currentValue: r.property.address2,
    },
    {
      type: 'TextInputNumber',
      label: 'Code Postal',
      placeholder: '1200',
      id: 'property.zipCode',
      currentValue: r.property.zipCode,
    },
    {
      type: 'TextInput',
      label: 'Localité',
      placeholder: 'Genève',
      id: 'property.city',
      currentValue: r.property.city,
    },
    {
      type: 'h3',
      text: 'Détails du bien',
    },
    {
      type: 'TextInputNumber',
      label: 'Nb. de chambres',
      placeholder: '3.5',
      id: 'property.roomCount',
      currentValue: r.property.roomCount,
      info: 'Chambres à coucher',
    },
    {
      type: 'TextInputNumber',
      label: 'Nb. de salles de bain',
      placeholder: '1',
      id: 'property.bathroomCount',
      currentValue: r.property.bathroomCount,
      info: 'Salles de bains ou salles d’eau (respectivement avec baignoire ou douche)',
    },
    {
      type: 'TextInputNumber',
      label: 'Nb. de WC',
      placeholder: '1',
      id: 'property.toiletCount',
      currentValue: r.property.toiletCount,
    },
    {
      type: 'TextInputNumber',
      label: <span>Surface du terrain en m<sup>2</sup></span>,
      placeholder: '250',
      id: 'property.landArea',
      currentValue: r.property.landArea,
      showCondition: r.property.style === 'villa',
    },
    {
      type: 'TextInputNumber',
      label: <span>Surface habitable en m<sup>2</sup></span>,
      placeholder: '150',
      id: 'property.insideArea',
      currentValue: r.property.insideArea,
    },
    {
      type: 'TextInputNumber',
      label: <span>Volume/Cubage en m<sup>3</sup></span>,
      placeholder: '1000',
      id: 'property.volume',
      currentValue: r.property.volume,
    },
    {
      type: 'TextInputNumber',
      label: 'Places de parc intérieur',
      placeholder: '1',
      id: 'property.parking.inside',
      currentValue: r.property.parking.inside,
    },
    {
      type: 'TextInputNumber',
      label: 'Box de parking',
      placeholder: '1',
      id: 'property.parking.box',
      currentValue: r.property.parking.box,
    },
    {
      type: 'TextInputNumber',
      label: 'Places de parc extérieur couvertes',
      placeholder: '1',
      id: 'property.parking.outsideCovered',
      currentValue: r.property.parking.outsideCovered,
    },
    {
      type: 'TextInputNumber',
      label: 'Places de parc extérieur non-couvertes',
      placeholder: '1',
      id: 'property.parking.outsideNotCovered',
      currentValue: r.property.parking.outsideNotCovered,
    },
    {
      type: 'RadioInput',
      label: 'Est-ce une construction Minergie?',
      radioLabels: ['Oui', 'Non'],
      values: [true, false],
      id: 'property.minergie',
      currentValue: r.property.minergie,
    },
    {
      type: 'TextInputLarge',
      label: 'Autres informations',
      placeholder: 'Aménagements extérieurs, piscine, jardins, cabanons, annexes, sous-sols utiles,...',
      id: 'property.other',
      currentValue: r.property.other,
      rows: 3,
    },
  ];
};

export default getPropertyArray;
