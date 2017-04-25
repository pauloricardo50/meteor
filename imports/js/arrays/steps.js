import React from 'react';

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
          subtitle: '5 min',
          isDone: () => true,
        },
        {
          title: 'Dites en plus sur vous',
          link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]._id}?tab=personal`,
          subtitle: '1 min',
          percent: () => personalInfoPercent(borrowers),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          title: 'Vérifiez vos finances',
          link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]._id}?tab=finance`,
          subtitle: '20 sec',
          isDone: () => borrowers.reduce((res, b) => res && b.logic.hasValidatedFinances, true),
        },
        {
          title: 'Décrivez votre propriété',
          link: `/app/requests/${loanRequest._id}/property`,
          subtitle: '4 min',
          percent: () => propertyPercent(loanRequest, borrowers),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          title: 'Uploadez les documents nécessaires',
          link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]._id}?tab=files`,
          subtitle: '10 min',
          percent: () => filesPercent(borrowers),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          title: "Vérification d'e-Potek",
          subtitle: '2h',
          link: `/app/requests/${loanRequest._id}/verification`,
          isDone: () => loanRequest.logic.adminValidated,
        },
        {
          title: "Faites l'expertise",
          subtitle: '1 min',
          link: `/app/requests/${loanRequest._id}/expertise`,
          isDone: () => loanRequest.logic.expertiseDone,
        },
      ],
    },

    // Step 2
    {
      nb: 2,
      title: 'Trouvez votre prêteur',
      subtitle: loanRequest.logic.step < 1 ? 'Dans 1 jour' : '3 jours',
      items: [
        {
          title: 'Vérifiez la structure de votre projet',
          link: `/app/requests/${loanRequest._id}/structure`,
          subtitle: '1 min',
          isDone: () => loanRequest.logic.hasValidatedStructure,
        },
        {
          title: 'Envoyez les enchères',
          link: `/app/requests/${loanRequest._id}/auction`,
          subtitle: '2 jours',
          isDone: () => loanRequest.logic.auctionStarted,
        },
        {
          title: 'Choisissez votre prêteur',
          subtitle: '5 min',
          link: `/app/requests/${loanRequest._id}/lenderpicker`,
          disabled: !serverTime || !loanRequest.logic.auctionEndTime > serverTime, // TODO: make this work
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
          subtitle: '45 min',
          percent: () => 0,
          isDone: () => false,
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

  // Make sure these indices correspond
  // Verify all 4 items before item 5 are done
  steps[0].items[5].disabled = !previousDone(steps, 0, 5);
  steps[0].items[6].disabled = !previousDone(steps, 0, 6);

  return steps;
};

export default getSteps;

export const previousDone = (steps, nb, itemNb) =>
  steps[nb].items.slice(0, itemNb).reduce((res, i) => res && i.isDone(), true);

export const getPercent = array => {
  const percent = array.reduce((tot, val) => (val !== undefined ? tot + 1 : tot), 0) / array.length;
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
      i.type === 'conditionalInput'
    ) {
      if (i.inputs[0].currentValue === i.conditionalTrueValue) {
        // If the conditional input is triggering the next input, add all values
        i.inputs.forEach(input => a.push(input.currentValue));
      } else {
        // If conditional value is not triggering
        a.push(i.inputs[0].currentValue);
      }
    } else if (
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
