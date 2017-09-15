import React from 'react';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

import { getBorrowerInfoArray } from './BorrowerFormArray';
import { borrowerFiles, requestFiles } from '/imports/js/arrays/files';
import getPropertyArray from './PropertyFormArray';
import { strategyDone } from '/imports/js/helpers/requestFunctions';

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
          link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]
            ._id}/personal`,
          percent: () => personalInfoPercent(borrowers),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          id: 'finance',
          link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]
            ._id}/finance`,
          isDone: () =>
            borrowers.reduce(
              (res, b) => res && b.logic.hasValidatedFinances,
              true,
            ),
        },
        {
          id: 'files',
          link: `/app/requests/${loanRequest._id}/borrowers/${borrowers[0]
            ._id}/files`,
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
          waiting: () =>
            loanRequest.logic.verification.requested &&
            !loanRequest.logic.verification.validated,
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
          waiting: () => loanRequest.logic.auction.status === 'started',
          isDone: () => loanRequest.logic.auction.status === 'ended',
          disabled: loanRequest.logic.step < 2,
        },
        {
          id: 'strategy',
          link: `/app/requests/${loanRequest._id}/strategy`,
          isDone: () => strategyDone(loanRequest),
        },
        {
          id: 'offerPicker',
          link: `/app/requests/${loanRequest._id}/offerpicker`,
          isDone: () =>
            !!(loanRequest.logic.lender && loanRequest.logic.lender.offerId),
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
          percent: () =>
            (filesPercent(loanRequest, requestFiles, 'contract') +
              filesPercent(borrowers, borrowerFiles, 'contract')) /
            (1 + borrowers.length),
          waiting: () =>
            loanRequest.logic.lender.contractRequested &&
            !loanRequest.logic.lender.contract,
          isDone() {
            return (
              loanRequest.files.contract &&
              loanRequest.files.contract.length &&
              this.percent() >= 1
            );
          },
        },
        {
          id: 'closing',
          link: `/app/requests/${loanRequest._id}/closing`,
          disabled: !(
            loanRequest.logic.lender &&
            loanRequest.logic.lender.contractRequested
          ),
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
      disabled: true, // TODO
      subtitle: null,
      items: [],
    },
  ];

  // Make sure these indices correspond
  // Verify all 3 items before item 4 are done
  steps[1].items[4].disabled = !previousDone(steps, 1, 4); // Vérification e-Potek
  // steps[0].items[6].disabled = !previousDone(steps, 0, 6); // Expertise

  steps[2].items[1].disabled = !previousDone(steps, 2, 1); // Enchères
  steps[2].items[2].disabled = !previousDone(steps, 2, 2); // Stratégie
  steps[2].items[3].disabled = !previousDone(steps, 2, 3); // Choix du prêteur

  return steps;
};

export default getSteps;

// Returns the current value of an autoForm input
const getCurrentValue = (input, doc) => get(doc, input.id);

/**
 * previousDone - Checks if all previous subSteps have been finished upto this
 * item
 *
 * @param {array} steps  An array of subSteps/items
 * @param {number} stepNb The step Number
 * @param {number} itemNb The number of the item that is concerned
 *
 * @return {boolean} Description
 */
export const previousDone = (steps, stepNb, itemNb) => {
  if (stepNb >= steps.length) {
    throw new Error('invalid stepNb');
  } else if (itemNb >= steps[stepNb].items.length) {
    throw new Error('invalid itemNb');
  }

  return steps[stepNb].items
    .slice(0, itemNb)
    .reduce((res, i) => res && i.isDone(), true);
};

/**
 * getPercent - Given an array of values, any value that is undefined or null
 * will be counted as incomplete, make sure we don't divide by 0
 *
 * @param {array} array Array of numbers, strings, or dates
 *
 * @return {number} a value between 0 and 1
 */
export const getPercent = (array = []) => {
  const percent =
    array.reduce((tot, val) => {
      if (isArray(val)) {
        return tot + (val.length ? 1 : 0);
      } else if (val !== undefined && val !== null) {
        return tot + 1;
      }
      return tot;
    }, 0) / array.length;
  return isFinite(percent) ? percent : 0;
};

/**
 * shouldCountField - A boolean to determine if a field in an array
 * should be counted or not
 *
 * @param {object} f A formArray field object
 *
 * @return {boolean} Description
 */
export const shouldCountField = f =>
  (f.condition === undefined || f.condition === true) &&
  f.required !== false &&
  !f.disabled &&
  f.type !== 'h3';

/**
 * getCountedArray - Returns an array of values that are mandatory and should
 * be counted to determine a completion percentage of a form
 *
 * @param {array}  formArray Description
 * @param {object}  doc       Description
 * @param {array} [arr=[]]  Description
 *
 * @return {array} an array with all the currentValues that are mandatory
 */
export const getCountedArray = (formArray, doc, arr = []) => {
  formArray.forEach((i) => {
    if (shouldCountField(i)) {
      if (i.type === 'conditionalInput') {
        if (getCurrentValue(i.inputs[0], doc) === i.conditionalTrueValue) {
          // If the conditional input is triggering the next input, add all values
          i.inputs.forEach(input => arr.push(getCurrentValue(input, doc)));
        } else {
          // If conditional value is not triggering
          arr.push(getCurrentValue(i.inputs[0], doc));
        }
      } else {
        arr.push(getCurrentValue(i, doc));
      }
    }
  });

  return arr;
};

/**
 * personalInfoPercent - Determines the completion rate of the borrower's
 * personal information forms
 *
 * @param {object} borrowers Description
 *
 * @return {number} A value between 0 and 1
 */
export const personalInfoPercent = (borrowers) => {
  const a = [];
  borrowers.forEach((b) => {
    const formArray = getBorrowerInfoArray(borrowers, b._id);
    getCountedArray(formArray, b, a);
  });

  return getPercent(a);
};

/**
 * propertyPercent - Determines the completion rate of the property forms
 *
 * @param {object} loanRequest Description
 * @param {object} borrowers   Description
 *
 * @return {number} A percentage between 0 and 1
 */
export const propertyPercent = (loanRequest, borrowers) => {
  const formArray = getPropertyArray(loanRequest, borrowers);
  const a = getCountedArray(formArray, loanRequest);

  return getPercent(a);
};

export const auctionFilesPercent = (borrowers) => {
  const a = [];
  borrowers.forEach((b) => {
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

/**
 * filesPercent - Determines the completion rate of file upload for a given
 * step, doc and array of files
 *
 * @param {object} doc           The mongoDB document where files are saved
 * @param {function} fileArrayFunc A function that returns an array of files
 * @param {number} step          The step that determines which files are
 * required at this moment
 *
 * @return {number} a value between 0 and 1 indicating the percentage of
 * completion, 1 is complete, 0 is not started
 */
export const filesPercent = (doc, fileArrayFunc, step) => {
  const a = [];
  const iterate = (files, doc2) => {
    if (isDemo()) {
      a.push(doc2.files[files[0].id]);
    } else {
      files.forEach(
        f =>
          !(f.required === false || f.condition === false) &&
          a.push(doc2.files[f.id]),
      );
    }
  };

  if (isArray(doc)) {
    doc.forEach((item) => {
      const fileArray = fileArrayFunc(item)[step];
      iterate(fileArray, item);
    });
  } else {
    const fileArray = fileArrayFunc(doc)[step];
    iterate(fileArray, doc);
  }

  return getPercent(a);
};

export const getCurrentLink = () => {};
