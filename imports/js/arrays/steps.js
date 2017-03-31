import React from 'react';

const getSteps = (loanRequest, borrowers) => {
  const multiple = borrowers && borrowers.length > 1;
  const steps = [
    // Step 1
    {
      nb: 1,
      title: 'Préparez votre dossier',
      subtitle: '15 minutes',
      items: [
        {
          title: 'Passez le test',
          isDone: () => true,
        },
        {
          title: 'Vérifiez vos finances',
          link: `/app/borrowers/${borrowers[0]._id}/finance`,
          isDone: () =>
            borrowers.reduce(
              (res, b) => res && b.logic.hasValidatedFinances,
              true,
            ),
        },
        {
          title: 'Dites-nous en un peu plus sur vous',
          link: multiple
            ? '/app/me'
            : `/app/borrowers/${borrowers[0]._id}/info`,
          percent: () => personalInfoPercent(borrowers),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          title: 'Décrivez-nous votre propriété',
          link: `/app/requests/${loanRequest._id}/property`,
          percent: () => propertyPercent(loanRequest),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          title: 'Vérifiez la structure de votre projet',
          link: `/app/requests/${loanRequest._id}`,
          isDone: () => loanRequest.logic.hasValidatedStructure,
        },
        {
          title: 'Envoyez les enchères',
          link: `/app/requests/${loanRequest._id}/auction`,
          isDone: () => loanRequest.logic.auctionStarted,
        },
      ],
    },

    // Step 2
    {
      nb: 2,
      title: 'Prenez les grandes décisions',
      subtitle: loanRequest.logic.step < 1 ? 'Dans 3 jours' : '30 minutes',
      items: [
        {
          title: 'Validez vos fonds propres',
          isDone: () => false,
        },
        {
          title: 'Choisissez votre stratégie de taux',
          isDone: () => false,
        },
        {
          title: 'Choisissez votre prêteur',
          isDone: () => false,
        },
        {
          title: "Choisissez votre stratégie d'amortissement",
          isDone: () => false,
        },
      ],
    },

    // Step 3
    {
      nb: 3,
      title: 'Finalisez votre demande',
      subtitle: loanRequest.logic.step < 2 ? 'Dans 4 jours' : '45 minutes',
      items: [
        {
          title: 'Uploadez les documents nécessaires',
          isDone: () => false,
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

  return steps.slice(0, loanRequest.logic.step + 1);
};

export default getSteps;

const personalInfoPercent = borrowers => {
  let a = [];
  borrowers.forEach(b => {
    a.push(b.firstName);
    a.push(b.lastName);
    a.push(b.gender);
    a.push(b.age);
    if (!b.sameAddress) {
      a.push(b.address1);
      a.push(b.zipCode);
      a.push(b.city);
    }
    a.push(b.citizenships);
    a.push(b.birthPlace);
    a.push(b.civilStatus);
    a.push(b.company);
    a.push(b.personalBank);
  });

  return getPercent(a);
};

const propertyPercent = loanRequest => {
  const p = loanRequest.property;
  let a = [];
  a.push(p.value);
  a.push(p.propertyWork);
  a.push(p.usageType);
  if (p.usageType === 'investment') {
    a.push(p.investmentRent);
  }
  a.push(p.style);
  if (p.style === 'villa') {
  } else if (p.style === 'flat') {
  }
  a.push(p.address1);
  a.push(p.zipCode);
  a.push(p.city);
  a.push(p.insideArea);
  a.push(p.landArea);

  return getPercent(a);
};

const getPercent = array => {
  const percent = array.reduce(
    (tot, val) => val !== undefined ? tot + 1 : tot,
    0,
  ) / array.length;
  return isFinite(percent) ? percent : 0;
};
