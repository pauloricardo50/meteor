import React from 'react';
import { Meteor } from 'meteor/meteor';

import { getFileArray } from '/imports/ui/pages/user/borrowerPage/Files.jsx';
import getPropertyArray from './PropertyFormArray';
import { getBorrowerInfoArray } from './BorrowerFormArray';

const getSteps = ({ loanRequest, borrowers, serverTime }) => {
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
          title: 'Dites en plus sur vous',
          link: `/app/borrowers/${borrowers[0]._id}?tab=personal`,
          percent: () => personalInfoPercent(borrowers),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          title: 'Vérifiez vos finances',
          link: `/app/borrowers/${borrowers[0]._id}?tab=finance`,
          isDone: () =>
            borrowers.reduce(
              (res, b) => res && b.logic.hasValidatedFinances,
              true,
            ),
        },
        {
          title: 'Décrivez votre propriété',
          link: `/app/requests/${loanRequest._id}/property`,
          percent: () => propertyPercent(loanRequest, borrowers),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          title: 'Uploadez les documents nécessaires',
          link: `/app/borrowers/${borrowers[0]._id}?tab=files`,
          percent: () => filesPercent(borrowers),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          title: "Vérification d'e-Potek",
          link: `/app/requests/${loanRequest._id}/verification`,
          isDone: () => loanRequest.logic.adminValidated,
        },
        {
          title: "Faites l'expertise",
          link: `/app/requests/${loanRequest._id}/expertise`,
          isDone: () => loanRequest.logic.expertiseDone,
        },
      ],
    },

    // Step 2
    {
      nb: 2,
      title: 'Les enchères',
      subtitle: loanRequest.logic.step < 1 ? 'Dans 3 jours' : '30 minutes',
      items: [
        {
          title: 'Vérifiez la structure de votre projet',
          link: `/app/requests/${loanRequest._id}/structure`,
          isDone: () => loanRequest.logic.hasValidatedStructure,
        },
        {
          title: 'Envoyez les enchères',
          link: `/app/requests/${loanRequest._id}/auction`,
          isDone: () => loanRequest.logic.auctionStarted,
        },
        {
          title: 'Choisissez votre prêteur',
          link: `/app/requests/${loanRequest._id}/lenderpicker`,
          disabled: !serverTime ||
            !loanRequest.logic.auctionEndTime > serverTime, // TODO: make this work
          isDone: () => !!loanRequest.logic.lender,
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
          title: 'Dernières démarches',
          link: `/app/requests/${loanRequest._id}/finalsteps`,
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

  // Make sure these indices correspond
  // Verify all 4 items before item 5 are done
  steps[0].items[5].disabled = !steps[0].items
    .slice(0, 5)
    .reduce((res, i) => res && i.isDone(), true);

  steps[0].items[6].disabled = !steps[0].items[5].isDone();

  // return steps.slice(0, loanRequest.logic.step + 1); // If you want to hide steps that aren't available
  return steps;
};

export default getSteps;

const getPercent = array => {
  const percent = array.reduce(
    (tot, val) => val !== undefined ? tot + 1 : tot,
    0,
  ) / array.length;
  return isFinite(percent) ? percent : 0;
};

export const personalInfoPercent = borrowers => {
  const a = [];
  borrowers.forEach(b => {
    const formArray = getBorrowerInfoArray(borrowers, b._id);
    formArray.forEach(i => {
      if (
        (i.showCondition === undefined || i.showCondition === true) &&
        i.required !== false &&
        i.type !== 'h3'
      ) {
        a.push(i.currentValue);
      }
    });
  });

  return getPercent(a);
};

export const propertyPercent = (loanRequest, borrowers) => {
  const a = [];
  const formArray = getPropertyArray(loanRequest, borrowers);

  formArray.forEach(i => {
    if (
      (i.showCondition === undefined || i.showCondition === true) &&
      i.required !== false &&
      i.type !== 'h3'
    ) {
      a.push(i.currentValue);
    }
  });

  return getPercent(a);
};

export const filesPercent = borrowers => {
  const a = [];
  borrowers.forEach(b => {
    const fileArray = getFileArray(b);

    // TODO: loop over each file, not just the first one
    a.push(fileArray[0].currentValue);
  });

  return getPercent(a);
};
