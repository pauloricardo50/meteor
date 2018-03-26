import React from 'react';
import get from 'lodash/get';
import isArray from 'lodash/isArray';

import { getBorrowerInfoArray } from './BorrowerFormArray';
import {
  borrowerDocuments,
  loanDocuments,
  propertyDocuments,
} from '../api/files/documents';
import { getPropertyArray, getPropertyLoanArray } from './PropertyFormArray';
import { strategyDone, getPropertyCompletion } from 'core/utils/loanFunctions';
import { arrayify } from '../utils/general';
import { isDemo } from 'core/utils/browserFunctions';
import {
  LOAN_STATUS,
  AUCTION_STATUS,
  FILE_STATUS,
  CLOSING_STEPS_STATUS,
  CLOSING_STEPS_TYPE,
  FILE_STEPS,
} from '../api/constants';

const getSteps = (props) => {
  const { loan, borrowers, property } = props;

  const steps = [
    {
      nb: 1,
      items: [
        {
          id: 'personal',
          link: `/loans/${loan._id}/borrowers/${borrowers[0]._id}/personal`,
          percent: () => personalInfoPercent(borrowers),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          id: 'finance',
          link: `/loans/${loan._id}/borrowers/${borrowers[0]._id}/finance`,

          isDone: () =>
            borrowers.reduce(
              (res, b) => res && b.logic.hasValidatedFinances,
              true,
            ),
          percent: () =>
            borrowers.reduce(
              (res, b) => (b.logic.hasValidatedFinances ? res + 1 : res),
              0,
            ) / borrowers.length,
        },
        {
          id: 'files',
          link: `/loans/${loan._id}/borrowers/${borrowers[0]._id}/files`,
          percent: () =>
            filesPercent({
              doc: borrowers,
              fileArrayFunc: borrowerDocuments,
              step: FILE_STEPS.AUCTION,
            }),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          id: 'property',
          link: `/loans/${loan._id}/property`,
          percent: () => getPropertyCompletion(props),
          isDone() {
            return this.percent() >= 1;
          },
        },
        {
          id: 'verification',
          link: `/loans/${loan._id}/verification`,
          waiting: () =>
            loan.logic.verification.requested &&
            !loan.logic.verification.validated,
          isDone: () => loan.logic.verification.validated === true,
        },
      ],
    },

    {
      nb: 2,
      items: [
        {
          id: 'structure',
          link: `/loans/${loan._id}/structure`,
          isDone: () => loan.logic.hasValidatedStructure,
          disabled: loan.logic.step < 2,
        },
        {
          id: 'auction',
          link: `/loans/${loan._id}/auction`,
          waiting: () => loan.logic.auction.status === AUCTION_STATUS.STARTED,
          isDone: () => loan.logic.auction.status === AUCTION_STATUS.ENDED,
          disabled: loan.logic.step < 2,
        },
        {
          id: 'strategy',
          link: `/loans/${loan._id}/strategy`,
          isDone: () => strategyDone({ loan }),
        },
        {
          id: 'offerPicker',
          link: `/loans/${loan._id}/offerpicker`,
          isDone: () => !!(loan.logic.lender && loan.logic.lender.offerId),
        },
      ],
    },

    {
      nb: 3,
      items: [
        {
          id: 'contract',
          link: `/loans/${loan._id}/contract`,
          disabled:
            loan.logic.step < 3 &&
            !(loan.logic.lender && loan.logic.lender.offerId),
          percent: () =>
            getAllFilesPercent(
              { loan, borrowers, property },
              FILE_STEPS.CONTRACT,
            ),
          waiting: () =>
            loan.logic.lender.contractRequested && !loan.logic.lender.contract,
          isDone() {
            return (
              loan.documents.contract &&
              loan.documents.contract.files &&
              loan.documents.contract.files.length
            );
          },
        },
        {
          id: 'closing',
          link: `/loans/${loan._id}/closing`,
          // FIXME: true && value used because of weird linting...
          disabled:
            (true &&
              getAllFilesPercent(
                { loan, borrowers, property },
                FILE_STEPS.CONTRACT,
              )) < 1 || loan.logic.step < 3,
          percent: () => closingPercent(loan),
          isDone: () => loan.status === LOAN_STATUS.DONE,
        },
      ],
    },

    {
      nb: 4,
      title: (
        <span
          className="fa fa-home fa-2x"
          style={{ color: '#ADB5BD', paddingLeft: 8 }}
        />
      ),
      disabled: true, // TODO
      subtitle: null,
      items: [],
    },
  ];

  setPreviousDone(steps, 0, 4); // Vérification e-Potek
  setPreviousDone(steps, 1, 1); // Enchères
  setPreviousDone(steps, 1, 2); // Stratégie
  setPreviousDone(steps, 1, 3); // Choix du prêteur

  // Make sure these indices correspond
  // Verify all 3 items before item 4 are done
  // steps[1].items[4].disabled = !previousDone(steps, 1, 4); // Vérification e-Potek

  // steps[2].items[1].disabled = !previousDone(steps, 2, 1); // Enchères
  // steps[2].items[2].disabled = !previousDone(steps, 2, 2); // Stratégie
  // steps[2].items[3].disabled = !previousDone(steps, 2, 3); // Choix du prêteur

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

const setPreviousDone = (steps, stepIndex, itemIndex) => {
  steps[stepIndex].items[itemIndex].disabled = !previousDone(
    steps,
    stepIndex,
    itemIndex,
  );
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
  arrayify(borrowers).forEach((b) => {
    const formArray = getBorrowerInfoArray({
      borrowers: arrayify(borrowers),
      borrowerId: b._id,
    });
    getCountedArray(formArray, b, a);
  });

  return getPercent(a);
};

/**
 * propertyPercent - Determines the completion rate of the property forms
 *
 * @param {object} loan Description
 * @param {object} borrowers   Description
 *
 * @return {number} A percentage between 0 and 1
 */
export const propertyPercent = (loan, borrowers, property) => {
  const formArray1 = getPropertyArray({ loan, borrowers, property });
  const formArray2 = getPropertyLoanArray({
    loan,
    borrowers,
    property,
  });

  let a = getCountedArray(formArray1, property);
  a = [...a, getCountedArray(formArray2, loan)];

  return getPercent(a);
};

export const auctionFilesPercent = (borrowers) => {
  const a = [];
  arrayify(borrowers).forEach((b) => {
    const fileArray = borrowerDocuments(b).auction;

    if (isDemo()) {
      a.push(b.files[fileArray[0].id]);
    } else {
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
export const filesPercent = ({ doc, fileArrayFunc, step, checkValidity }) => {
  const a = [];
  const iterate = (files, doc2) => {
    if (!doc2 || !doc2.documents) {
      return;
    }

    files.forEach((f) => {
      // Check if this file should be verified
      if (!(f.required === false || f.condition === false)) {
        if (doc2.documents[f.id]) {
          if (checkValidity) {
            a.push(isArray(doc2.documents[f.id].files) &&
              doc2.documents[f.id].files.every(file => file.status === FILE_STATUS.VALID)
              ? true
              : undefined);
          } else {
            a.push(...doc2.documents[f.id].files);
          }
        } else {
          // document doesn't even exist
          a.push(undefined);
        }
      }
    });
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

export const getAllFilesPercent = ({ loan, borrowers, property }, step) => {
  const array = [];
  if (loan) {
    array.push(filesPercent({ doc: loan, fileArrayFunc: loanDocuments, step }));
  }

  if (borrowers) {
    array.push(filesPercent({ doc: borrowers, fileArrayFunc: borrowerDocuments, step }));
  }

  if (property) {
    array.push(filesPercent({ doc: property, fileArrayFunc: propertyDocuments, step }));
  }

  // Sum and divide by amount of them
  return array.reduce((a, b) => a + b, 0) / array.length;
};

export const closingPercent = (loan) => {
  const { closingSteps } = loan.logic;
  const arr = [];

  closingSteps.forEach((step) => {
    if (step.type === CLOSING_STEPS_TYPE.TODO) {
      arr.push(step.status === CLOSING_STEPS_STATUS.VALID ? true : undefined);
    } else {
      arr.push(isArray(loan.files[step.id]) &&
        loan.files[step.id].every(file => file.status === CLOSING_STEPS_STATUS.VALID)
        ? true
        : undefined);
    }
  });

  return getPercent(arr);
};
