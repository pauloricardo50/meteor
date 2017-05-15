import React from 'react';
import { _ } from 'lodash';

import { getBorrowerInfoArray } from './BorrowerFormArray';
import { borrowerFiles } from '/imports/js/arrays/files';
import getPropertyArray from './PropertyFormArray';

import { isDemo } from '/imports/js/helpers/browserFunctions';

const getSteps = ({ loanRequest, borrowers, serverTime }) => {
  const steps = [
    // Step 1
    {
      nb: 0,
      title: '1. Préparez votre dossier',
      subtitle: '15 minutes',
      items: [
        {
          id: 'test',
          title: 'Passez le test',
          subtitle: '5 min',
          isDone: () => true,
        },
        ...borrowers.map((b, i) => ({
          id: `profile${i}`,
          title: `Complétez votre profil ${borrowers.length > 1 ? i + 1 : ''}`,
          subtitle: '15 min',
          link: `/app/requests/${loanRequest._id}/borrowers/${b._id}`,
          percent: () => {
            const personal = personalInfoPercent([b]);
            const files = auctionFilesPercent([b]);
            const finance = b.logic.hasValidatedFinances ? 1 : 0;
            return (personal + files + finance) / 3;
          },
          isDone() {
            return this.percent() >= 1;
          },
        })),
        // {
        //   title: 'Dites en plus sur vous',
        //   link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]._id}?tab=personal`,
        //   subtitle: '1 min',
        //   percent: () => personalInfoPercent(borrowers),
        //   isDone() {
        //     return this.percent() >= 1;
        //   },
        // },
        // {
        //   title: 'Vérifiez vos finances',
        //   link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]._id}?tab=finance`,
        //   subtitle: '20 sec',
        //   isDone: () => borrowers.reduce((res, b) => res && b.logic.hasValidatedFinances, true),
        // },
        // {
        //   title: 'Uploadez les documents',
        //   link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]._id}?tab=files`,
        //   subtitle: '10 min',
        //   percent: () => mandatoryFilesPercent(borrowers),
        //   isDone() {
        //     return this.percent() >= 1;
        //   },
        // },
        {
          id: 'property',
          title: 'Décrivez votre propriété',
          link: `/app/requests/${loanRequest._id}/property`,
          subtitle: '4 min',
          percent: () => propertyPercent(loanRequest, borrowers),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          id: 'verification',
          title: "Vérification d'e-Potek",
          subtitle: '2h',
          link: `/app/requests/${loanRequest._id}/verification`,
          isDone: () => loanRequest.logic.verification.validated === true,
        },
        // {
        //   title: "Faites l'expertise",
        //   subtitle: '1 min',
        //   link: `/app/requests/${loanRequest._id}/expertise`,
        //   isDone: () => loanRequest.logic.expertiseDone,
        // },
      ],
    },

    // Step 2
    {
      nb: 1,
      title: '2. Trouvez votre prêteur',
      subtitle: loanRequest.logic.step < 1 ? 'Dans 1 jour' : '3 jours',
      items: [
        {
          id: 'structure',
          title: 'Vérifiez la structure de votre projet',
          link: `/app/requests/${loanRequest._id}/structure`,
          subtitle: '1 min',
          isDone: () => loanRequest.logic.hasValidatedStructure,
          disabled: loanRequest.logic.step < 1,
        },
        {
          id: 'auction',
          title: 'Envoyez les enchères',
          link: `/app/requests/${loanRequest._id}/auction`,
          subtitle: '2 jours',
          isDone: () =>
            loanRequest.logic.auctionStarted && loanRequest.logic.auctionEndTime <= serverTime,
          disabled: loanRequest.logic.step < 1,
        },
        {
          id: 'lenderPicker',
          title: 'Choisissez votre prêteur',
          subtitle: '5 min',
          link: `/app/requests/${loanRequest._id}/lenderpicker`,
          disabled: loanRequest.logic.step < 1 &&
            !(serverTime &&
              loanRequest.logic.auctionEndTime &&
              loanRequest.logic.auctionEndTime > serverTime),
          isDone: () => !!(loanRequest.logic.lender && loanRequest.logic.lender.offerId),
        },
      ],
    },

    // Step 3
    {
      nb: 2,
      title: '3. Finalisez votre demande',
      subtitle: loanRequest.logic.step < 2 ? 'Dans 4 jours' : '45 minutes',
      items: [
        {
          id: 'finalSteps',
          title: 'Dernières démarches',
          link: `/app/requests/${loanRequest._id}/finalsteps`,
          subtitle: '45 min',
          disabled: loanRequest.logic.step < 2 &&
            !(loanRequest.logic.lender && loanRequest.logic.lender.offerId),
          percent: () => 0,
          isDone: () => false,
        },
      ],
    },

    // Step 4
    {
      nb: 3,
      title: React.createElement('span', { className: 'fa fa-home fa-2x' }, null),
      description: 'Félicitations, vous êtes arrivé au bout, profitez de votre nouvelle propriété comme il se doit.',
      items: [],
    },
  ];

  // Make sure these indices correspond
  // Verify all 4 items before item 5 are done
  steps[0].items[3].disabled = !previousDone(steps, 0, 3); // Vérification e-Potek
  // steps[0].items[6].disabled = !previousDone(steps, 0, 6); // Expertise

  steps[1].items[1].disabled = !previousDone(steps, 1, 1); // Enchères
  steps[1].items[2].disabled = !previousDone(steps, 1, 2); // Choix du prêteur

  return steps;
};

export default getSteps;

// Returns the current value of an autoForm input
const getCurrentValue = (input, doc) => _.get(doc, input.id);

export const previousDone = (steps, nb, itemNb) =>
  steps[nb].items.slice(0, itemNb).reduce((res, i) => res && i.isDone(), true);

// Any value that is undefined or null will be counted as incomplete
export const getPercent = array => {
  const percent =
    array.reduce((tot, val) => (val !== undefined && val !== null ? tot + 1 : tot), 0) /
    array.length;
  return isFinite(percent) ? percent : 0;
};

// A boolean to determine if a field in an array should be counted or not
const shouldCountField = f =>
  (f.showCondition === undefined || f.showCondition === true) &&
  f.required !== false &&
  !f.disabled &&
  f.type !== 'h3';

const getCountedArray = (formArray, doc, arr = []) => {
  formArray.forEach(i => {
    if (shouldCountField(i) && i.type === 'conditionalInput') {
      if (getCurrentValue(i.inputs[0], doc) === i.conditionalTrueValue) {
        // If the conditional input is triggering the next input, add all values
        i.inputs.forEach(input => arr.push(getCurrentValue(input, doc)));
      } else {
        // If conditional value is not triggering
        arr.push(getCurrentValue(i.inputs[0], doc));
      }
    } else if (shouldCountField(i)) {
      arr.push(getCurrentValue(i, doc));
    }
  });

  return arr;
};

export const personalInfoPercent = borrowers => {
  const a = [];
  borrowers.forEach(b => {
    const formArray = getBorrowerInfoArray(borrowers, b._id);
    getCountedArray(formArray, b, a);
  });

  return getPercent(a);
};

export const propertyPercent = (loanRequest, borrowers) => {
  const formArray = getPropertyArray(loanRequest, borrowers);
  const a = getCountedArray(formArray, loanRequest);

  return getPercent(a);
};

export const auctionFilesPercent = borrowers => {
  const a = [];
  borrowers.forEach(b => {
    const fileArray = borrowerFiles(b).auction;

    if (isDemo()) {
      a.push(b.files[fileArray[0].id]);
    } else {
      a.push(b.hasChangedSalary);
      fileArray.forEach(f => f.condition !== false && a.push(b.files[f.id]));
    }
  });

  return getPercent(a);
};
