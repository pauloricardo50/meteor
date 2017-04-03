import React from 'react';

export const getBorrowerInfoArray = (borrowers, id) => {
  const b = borrowers.find(borr => borr._id === id);
  const multiple = borrowers.length > 1;
  // If this is the first borrower in the array of borrowers, don't ask for same address
  const isFirst = borrowers[0]._id === id;

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
      label: `Utiliser la même adresse que ${borrowers[0].firstName || 'Emprunteur 1'}?`,
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
      required: false,
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
      required: false,
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
    {
      type: 'TextInput',
      label: 'Votre Banque Personelle',
      placeholder: 'UBS SA',
      id: 'personalBank',
      currentValue: b.personalBank,
    },
  ];
};

export const getBorrowerFinanceArray = (props, id) => {
  const b = props.borrowers.find(borr => borr._id === id);
  const multiple = props.borrowers.length > 1;
  // If this is the first borrower in the array of borrowers, don't ask for same address
  const isFirst = props.borrowers[0]._id === id;

  if (!b) {
    return [];
  }

  const incomeArray = [
    {
      type: 'h3',
      text: 'Revenus',
    },
    {
      type: 'TextInputMoney',
      label: 'Revenus bruts annuels',
      placeholder: "CHF 50'000",
      id: 'salary',
      currentValue: b.salary,
    },
    // {
    //   type: 'TextInputMoney',
    //   label: 'Autres revenus',
    //   placeholder: '',
    //   id: `personalInfo.borrowers.${index}.otherIncome`,
    //   currentValue: rp.borrowers[index].otherIncome,
    // },
  ];

  const fortuneArray = [
    {
      type: 'h3',
      text: 'Fortune',
    },
    // {
    //   type: 'TextInputMoney',
    //   label: 'Biens immobiliers existants',
    //   placeholder: "CHF 500'000",
    //   id: `borrowers.${index}.realEstateFortune`,
    //   currentValue: r.borrowers[index].realEstateFortune,
    // },
    // {
    //   type: 'TextInputMoney',
    //   label: 'Cash et titres',
    //   placeholder: "CHF 100'000",
    //   id: `borrowers.${index}.cashAndSecurities`,
    //   currentValue: r.borrowers[index].cashAndSecurities,
    // },
    // {
    //   type: 'TextInputMoney',
    //   label: 'Dette existante',
    //   placeholder: "CHF 20'000",
    //   id: `borrowers.${index}.existingDebt`,
    //   currentValue: r.borrowers[index].existingDebt,
    // },
    // {
    //   type: 'Autre fortune',
    //   label: 'Cash et titres',
    //   placeholder: 'CHF 100\'000',
    //   id: `borrowers.${index}.otherFortune`,
    //   currentValue: r.borrowers[index].otherFortune,
    // },
  ];

  const insuranceArray = [
    {
      type: 'h3',
      text: 'Assurances',
      // showCondition: index === 0,
    },
    {
      type: 'TextInputMoney',
      label: 'LPP / 2ème Pilier',
      placeholder: "CHF 100'000",
      id: 'insuranceLpp',
      currentValue: b.insuranceLpp,
    },
    {
      type: 'TextInputMoney',
      label: 'Assurance 3A',
      placeholder: "CHF 100'000",
      id: 'insurance3A',
      currentValue: b.Insurance3A,
    },
    {
      type: 'TextInputMoney',
      label: 'Assurance 3B',
      placeholder: "CHF 100'000",
      id: 'insurance3B',
      currentValue: b.insurance3B,
    },
    {
      type: 'TextInputMoney',
      label: 'Risque Pure',
      placeholder: "CHF 100'000",
      id: 'insurancePureRisk',
      currentValue: b.insurancePureRisk,
    },
  ];

  return incomeArray.concat([...fortuneArray, ...insuranceArray]);
};
