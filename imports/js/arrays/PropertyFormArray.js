import React from 'react';

const getPropertyArray = (loanRequest, borrowers) => {
  const r = loanRequest;

  if (!r) {
    throw new Error('requires a loanRequest');
  }

  return [
    {
      id: 'property.value',
      type: 'textInput',
      money: true,
      label: "Prix d'Achat",
      placeholder: "CHF 500'000",
    },
    {
      id: 'property.propertyWork',
      type: 'textInput',
      money: true,
      label: 'Travaux de plus-value',
      placeholder: "CHF 50'000",
      required: false,
    },
    {
      id: 'property.usageType',
      type: 'radioInput',
      label: 'Utilisation de la propriété',
      options: [
        {
          id: 'primary',
          label: 'Résidence Principale',
        },
        {
          id: 'secondary',
          label: 'Résidence Secondaire',
        },
        {
          id: 'investment',
          label: "Bien d'investissement",
        },
      ],
    },
    {
      id: 'property.style',
      type: 'radioInput',
      label: 'Type de bien immobilier',
      options: [
        {
          id: 'villa',
          label: 'Villa',
        },
        {
          id: 'flat',
          label: 'Appartement',
        },
      ],
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: 'other',
      condition:
        borrowers.length > 1 && r.general.purchaseType === 'refinancing',
      inputs: [
        {
          id: 'general.currentOwner',
          type: 'radioInput',
          label: 'Qui est le propriétaire actuel?',
          options: [
            { id: '0', label: borrowers[0].firstName || 'Emprunteur 1' },
            {
              id: '1',
              label: (borrowers[1] && borrowers[1].firstName) || 'Emprunteur 2',
            },
            { id: 'both', label: 'Les Deux' },
            { id: 'other', label: 'Autre' },
          ],
        },
        {
          id: 'general.otherOwner',
          type: 'textInput',
          label: 'Autre propriétaire',
          placeholder: '',
        },
      ],
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: 'other',
      condition:
        borrowers.length > 1 && r.general.purchaseType !== 'refinancing',
      inputs: [
        {
          id: 'general.futureOwner',
          type: 'radioInput',
          label: 'Qui sera le propriétaire du bien immobilier?',
          options: [
            { id: '0', label: borrowers[0].firstName || 'Emprunteur 1' },
            {
              id: '1',
              label: (borrowers[1] && borrowers[1].firstName) || 'Emprunteur 2',
            },
            { id: 'both', label: 'Les Deux' },
            { id: 'other', label: 'Autre' },
          ],
        },
        {
          id: 'general.otherOwner',
          type: 'textInput',
          label: 'Autre propriétaire',
          placeholder: '',
        },
      ],
    },
    {
      id: 'property.isNew',
      type: 'radioInput',
      label: 'Est-ce un bien neuf?',
      options: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
      condition: r.general.purchaseType === 'acquisition',
    },
    {
      type: 'h3',
      text: 'Adresse du bien immobilier',
      ignore: true,
    },
    {
      id: 'property.address1',
      type: 'textInput',
      label: 'Adresse 1',
      placeholder: 'Rue des Champs 7',
    },
    {
      id: 'property.address2',
      type: 'textInput',
      label: 'Adresse 2',
      placeholder: '',
      required: false,
    },
    {
      id: 'property.zipCode',
      type: 'textInput',
      number: true,
      label: 'Code Postal',
      placeholder: '1200',
      saveOnChange: false,
    },
    {
      id: 'property.city',
      type: 'textInput',
      label: 'Localité',
      placeholder: 'Genève',
    },
    {
      type: 'h3',
      text: 'Détails du bien',
      ignore: true,
    },
    {
      id: 'property.constructionYear',
      type: 'textInput',
      number: true,
      label: 'Année de construction',
      placeholder: '2005',
    },
    {
      id: 'property.renovationYear',
      type: 'textInput',
      number: true,
      label: 'Année de rénovation',
      placeholder: '2010',
      required: false,
      info: 'Seulement si la propriété a été rénovée',
    },
    {
      id: 'property.landArea',
      type: 'textInput',
      number: true,
      label: (
        <span>
          Surface du terrain en m<sup>2</sup> *
        </span>
      ),
      placeholder: '250',
      condition: r.property.style === 'villa',
    },
    {
      id: 'property.insideArea',
      type: 'textInput',
      number: true,
      label: (
        <span>
          Surface habitable en m<sup>2</sup> *
        </span>
      ),
      placeholder: '150',
    },
    {
      id: 'property.balconyArea',
      type: 'textInput',
      number: true,
      label: (
        <span>
          Surface des balcons en m<sup>2</sup>
        </span>
      ),
      placeholder: '20',
      required: false,
    },
    {
      id: 'property.terraceArea',
      type: 'textInput',
      number: true,
      label: (
        <span>
          Surface des terrasses en m<sup>2</sup>
        </span>
      ),
      placeholder: '40',
      required: false,
    },
    {
      id: 'property.volume',
      type: 'textInput',
      number: true,
      label: (
        <span>
          Volume/Cubage en m<sup>3</sup> *
        </span>
      ),
      placeholder: '1000',
      condition: r.property.style === 'villa',
    },
    {
      id: 'property.volumeNorm',
      type: 'textInput',
      label: 'Type de cubage',
      placeholder: 'SIA',
      condition: r.property.style === 'villa',
    },
    {
      id: 'property.roomCount',
      type: 'textInput',
      decimal: true,
      label: 'Nb. de chambres',
      placeholder: '3.5',
      info: 'Chambres à coucher',
    },
    {
      id: 'property.bathroomCount',
      type: 'textInput',
      number: true,
      label: 'Nb. de salles de bain',
      placeholder: '1',
      info:
        'Salles de bains ou salles d’eau (respectivement avec baignoire ou douche)',
    },
    {
      id: 'property.toiletCount',
      type: 'textInput',
      number: true,
      label: 'Nb. de WC',
      placeholder: '1',
    },
    {
      id: 'property.parking.box',
      type: 'textInput',
      number: true,
      label: 'Box de parking',
      placeholder: '1',
    },
    {
      id: 'property.parking.inside',
      type: 'textInput',
      number: true,
      label: 'Places de parc intérieur',
      placeholder: '1',
    },
    {
      id: 'property.parking.outside',
      type: 'textInput',
      number: true,
      label: 'Places de parc extérieur',
      placeholder: '1',
    },
    {
      id: 'property.minergie',
      type: 'radioInput',
      label: 'Est-ce une construction Minergie?',
      options: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: true,
      condition: r.property.style === 'villa',
      inputs: [
        {
          id: 'property.isCoproperty',
          type: 'radioInput',
          label: 'Est-ce une copropriété',
          options: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
        },
        {
          id: 'property.copropertyPercentage',
          type: 'textInput',
          number: true,
          label: 'Répartition du bien au sein de la copropriété',
          placeholder: '0.125',
          info: 'Au millième',
        },
      ],
    },
    {
      id: 'property.copropertyPercentage',
      type: 'textInput',
      decimal: true,
      label: 'Répartition du bien au sein de la copropriété',
      placeholder: '0.125',
      condition: r.property.style === 'flat',
      info: 'Au millième',
    },
    {
      type: 'h3',
      text: 'Qualité et Emplacement',
      ignore: true,
    },
    {
      id: 'property.cityPlacementQuality',
      type: 'radioInput',
      label: "Type d'emplacement au sein de la commune",
      options: [
        { id: 0, label: 'Mauvais' },
        { id: 1, label: 'Moyen' },
        { id: 2, label: 'Bon' },
        { id: 3, label: 'Très Bon' },
      ],
    },
    {
      id: 'property.buildingPlacementQuality',
      type: 'radioInput',
      label: "Emplacement dans l'immeuble",
      options: [
        { id: 0, label: 'Mauvais' },
        { id: 1, label: 'Moyen' },
        { id: 2, label: 'Bon' },
        { id: 3, label: 'Très Bon' },
      ],
      condition: r.property.style === 'flat',
    },
    {
      id: 'property.buildingQuality',
      type: 'radioInput',
      label: 'Condition d’entretien du bâtiment',
      options: [
        { id: 0, label: 'Mauvais' },
        { id: 1, label: 'Moyen' },
        { id: 2, label: 'Bon' },
        { id: 3, label: 'Très Bon' },
      ],
    },
    {
      id: 'property.flatQuality',
      type: 'radioInput',
      label: 'Condition d’entretien de l’appartement',
      options: [
        { id: 0, label: 'Mauvais' },
        { id: 1, label: 'Moyen' },
        { id: 2, label: 'Bon' },
        { id: 3, label: 'Très Bon' },
      ],
      condition: r.property.style === 'flat',
    },
    {
      id: 'property.materialsQuality',
      type: 'radioInput',
      label: 'Qualité des matériaux',
      options: [
        { id: 0, label: 'Mauvais' },
        { id: 1, label: 'Moyen' },
        { id: 2, label: 'Bon' },
        { id: 3, label: 'Très Bon' },
      ],
    },
    {
      id: 'property.other',
      type: 'textInputLarge',
      label: 'Autres informations',
      placeholder:
        'Aménagements extérieurs, piscine, jardins, cabanons, annexes, sous-sols utiles,...',
      rows: 3,
      required: false,
    },
  ];
};

export default getPropertyArray;
