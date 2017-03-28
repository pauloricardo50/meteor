import React from 'react';

const getSteps = (loanRequest, borrowers) => {
  const multiple = borrowers && borrowers.length > 1;
  return [
    // Step 1
    {
      nb: 1,
      title: 'Préparez votre dossier',
      items: [
        {
          title: 'Passez le test',
          isDone: true,
        },
        {
          title: 'Dites-nous en un peu plus sur vous',
          isDone: false,
          link: multiple ? '/app/me' : `/app/borrowers/${borrowers[0]._id}`,
          percent: 0,
        },
        {
          title: 'Décrivez-nous votre propriété',
          isDone: false,
          link: `/app/requests/${loanRequest._id}/property`,
          percent: 0,
        },
        {
          title: 'Vérifiez la structure de votre projet',
          isDone: false,
          link: `/app/requests/${loanRequest._id}`,
        },
        {
          title: 'Envoyez les enchères',
          isDone: false,
          link: `/app/requests/${loanRequest._id}/auction`,
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
        },
        {
          title: 'Choisissez votre stratégie de taux',
          isDone: false,
        },
        {
          title: 'Choisissez votre prêteur',
          isDone: false,
        },
        {
          title: "Choisissez votre stratégie d'amortissement",
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
      title: React.createElement(
        'span',
        { className: 'fa fa-home fa-2x' },
        null,
      ),
      description: 'Félicitations, vous êtes arrivé au bout, profitez de votre nouvelle propriété comme il se doit.',
    },
  ];
};

export default getSteps;
