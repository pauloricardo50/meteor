import React from 'react';
import { _ } from 'lodash';

import { getBorrowerInfoArray } from './BorrowerFormArray';
import { borrowerFiles, requestFiles } from '/imports/js/arrays/files';
import getPropertyArray from './PropertyFormArray';

import { isDemo } from '/imports/js/helpers/browserFunctions';

const getSteps = ({ loanRequest, borrowers, serverTime }) => {
  const steps = [
    {
      nb: 0,
      items: [],
    },

    {
      nb: 1,
      items: [
        {
          id: 'personal',
          link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]._id}/personal`,
          percent: () => personalInfoPercent(borrowers),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          id: 'finance',
          link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]._id}/finance`,
          isDone: () => borrowers.reduce((res, b) => res && b.logic.hasValidatedFinances, true),
        },
        {
          id: 'files',
          link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]._id}/files`,
          percent: () => filesPercent(borrowers, borrowerFiles, 'auction'),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          id: 'property',
          link: `/app/requests/${loanRequest._id}/property`,
          percent: () =>
            (propertyPercent(loanRequest, borrowers) +
              filesPercent(loanRequest, requestFiles, 'auction')) /
            2,
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          id: 'verification',
          link: `/app/requests/${loanRequest._id}/verification`,
          isDone: () => loanRequest.logic.verification.validated === true,
        },
      ],
    },

    {
      nb: 2,
      items: [
        {
          id: 'structure',
          link: `/app/requests/${loanRequest._id}/structure`,
          isDone: () => loanRequest.logic.hasValidatedStructure,
          disabled: loanRequest.logic.step < 2,
        },
        {
          id: 'auction',
          link: `/app/requests/${loanRequest._id}/auction`,
          isDone: () =>
            loanRequest.logic.auctionStarted && loanRequest.logic.auctionEndTime <= serverTime,
          disabled: loanRequest.logic.step < 2,
        },
        {
          id: 'lenderPicker',
          link: `/app/requests/${loanRequest._id}/lenderpicker`,
          disabled:
            loanRequest.logic.step < 2 &&
              !(
                serverTime &&
                loanRequest.logic.auctionEndTime &&
                loanRequest.logic.auctionEndTime > serverTime
              ),
          isDone: () => !!(loanRequest.logic.lender && loanRequest.logic.lender.offerId),
        },
      ],
    },

    {
      nb: 3,
      items: [
        {
          id: 'contract',
          link: `/app/requests/${loanRequest._id}/contract`,
          disabled:
            loanRequest.logic.step < 3 &&
              !(loanRequest.logic.lender && loanRequest.logic.lender.offerId),
          percent: () => 0,
          isDone: () => false,
        },
        {
          id: 'closing',
          link: `/app/requests/${loanRequest._id}/closing`,
          disabled: true, // TODO
          percent: () => 0,
          isDone: () => false,
        },
      ],
    },

    {
      nb: 4,
      title: React.createElement(
        'span',
        {
          className: 'fa fa-home fa-2x',
          style: { color: '#ADB5BD', paddingLeft: 8 },
        },
        null,
      ),
      subtitle: null,
      items: [],
    },
  ];

  // Make sure these indices correspond
  // Verify all 3 items before item 4 are done
  steps[1].items[4].disabled = !previousDone(steps, 1, 4); // Vérification e-Potek
  // steps[0].items[6].disabled = !previousDone(steps, 0, 6); // Expertise

  steps[2].items[1].disabled = !previousDone(steps, 2, 1); // Enchères
  steps[2].items[2].disabled = !previousDone(steps, 2, 2); // Choix du prêteur

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
  (f.condition === undefined || f.condition === true) &&
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

export const filesPercent = (doc, fileArrayFunc, step) => {
  const a = [];
  const iterate = (files, doc2) => {
    if (isDemo()) {
      a.push(doc2.files[files[0].id]);
    } else {
      files.forEach(f => f.condition !== false && a.push(doc2.files[f.id]));
    }
  };

  if (_.isArray(doc)) {
    doc.forEach(item => {
      const fileArray = fileArrayFunc(item)[step];
      iterate(fileArray, item);
    });
  } else {
    const fileArray = fileArrayFunc(doc)[step];
    iterate(fileArray, doc);
  }

  return getPercent(a);
};
