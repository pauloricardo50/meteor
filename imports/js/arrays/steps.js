import React from 'react';

const steps = [
// Step 1
  {
    nb: 1,
    title: 'Préparez votre dossier',
    items: [
      {
        title: 'Passez le test',
        isDone: true,
        percent: 1,
      }, {
        title: 'Vérifiez la structure de votre projet',
        isDone: false,
      }, {
        title: 'Dites-nous en un peu plus sur vous',
        isDone: false,
      }, {
        title: 'Décrivez-nous votre chère propriété',
        isDone: false,
      }, {
        title: 'Envoyez les enchères',
        isDone: false,
      },
    ],
  },


// Step 2
  {
    nb: 2,
    title: 'Prenez les grandes décisions',
    items: [
      {
        title: 'Validez vos fonds propres',
        isDone: false,
      }, {
        title: 'Choisissez votre stratégie de taux',
        isDone: false,
      }, {
        title: 'Choisissez votre prêteur',
        isDone: false,
      }, {
        title: 'Choisissez votre stratégie d\'amortissement',
        isDone: false,
      },
    ],
  },


// Step 3
  {
    nb: 3,
    title: 'Finalisez votre demande',
    items: [
      {
        title: 'Uploadez les documents nécessaires',
        isDone: false,
      },
    ],
  },


// Step 4
  {
    nb: 4,
    title: React.createElement('span', { className: 'fa fa-home fa-2x' }, null),
    description: 'Félicitations, vous êtes arrivé au bout, profitez de votre nouvelle propriété comme il se doit.',
  },
];

export default steps;
