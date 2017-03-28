import React from 'react';

const getBorrowerFormArray = (props, id) => {
  const b = props.borrowers.find(borr => borr._id === id);
  const multiple = props.borrowers.length > 1;
  // If this is the first borrower in the array of borrowers, don't ask for same address
  const isFirst = props.borrowers[0]._id === id;

  if (!b) {
    return [];
  }

  return [
    {
      type: 'TextInput',
      label: 'Prénom',
      placeholder: 'Jean',
      id: 'firstName',
      currentValue: b.firstName,
    },
    {
      type: 'TextInput',
      label: 'Nom',
      placeholder: 'Ducret',
      id: 'lastName',
      currentValue: b.lastName,
    },
    {
      type: 'RadioInput',
      label: 'Genre',
      radioLabels: ['Femme', 'Homme', 'Autre'],
      values: ['f', 'm', 'other'],
      id: 'gender',
      currentValue: b.gender,
    },
    {
      type: 'h3',
      text: 'Votre addresse',
    },
    {
      type: 'RadioInput',
      label: `Utiliser la même adresse que ${props.borrowers[0].firstName || 'Emprunteur 1'}?`,
      radioLabels: ['Oui', 'Non'],
      values: [true, false],
      id: 'sameAddress',
      currentValue: b.sameAddress,
      showCondition: multiple && !isFirst,
    },
    {
      type: 'TextInput',
      label: 'Adresse 1',
      placeholder: 'Rue des Champs 7',
      id: 'address1',
      currentValue: b.address1,
      disabled: b.sameAddress,
    },
    {
      type: 'TextInput',
      label: 'Adresse 2',
      placeholder: '',
      id: 'address2',
      currentValue: b.address2,
      disabled: b.sameAddress,
    },
    {
      type: 'TextInputNumber',
      label: 'Code Postal',
      placeholder: '1200',
      id: 'zipCode',
      currentValue: b.zipCode,
      disabled: b.sameAddress,
    },
    {
      type: 'TextInput',
      label: 'Localité',
      placeholder: 'Genève',
      id: 'city',
      currentValue: b.city,
      disabled: b.sameAddress,
    },
    {
      type: 'TextInput',
      label: 'Nationalités',
      placeholder: 'Suisse, Français',
      id: 'citizenships',
      currentValue: b.citizenships,
    },
    {
      type: 'TextInput',
      label: 'Permis de résidence',
      placeholder: 'Permis C',
      id: 'residencyPermit',
      currentValue: b.residencyPermit,
      info: "Si vous n'êtes pas Suisse",
    },
    {
      type: 'TextInputNumber',
      label: 'Age',
      placeholder: '40',
      id: 'age',
      currentValue: b.age,
    },
    {
      type: 'TextInput',
      label: 'Lieu de Naissance',
      placeholder: 'Berne, Suisse',
      id: 'birthPlace',
      currentValue: b.birthPlace,
    },
    {
      type: 'RadioInput',
      label: 'État civil',
      radioLabels: b.gender === 'f'
        ? ['Mariée', 'Pacsée', 'Célibataire', 'Divorcée']
        : ['Marié', 'Pacsé', 'Célibataire', 'Divorcé'],
      values: ['married', 'pacsed', 'single', 'divorced'],
      id: 'civilStatus',
      currentValue: b.civilStatus,
    },
    {
      type: 'TextInput',
      label: 'Employeur',
      placeholder: 'Google',
      id: 'company',
      currentValue: b.company,
    },
  ];
};

export default getBorrowerFormArray;
