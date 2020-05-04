import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { INSURANCE_REQUESTS_COLLECTION } from '../../insuranceRequests/insuranceRequestConstants';
import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';
import { INSURANCES_COLLECTION } from '../../insurances/insuranceConstants';
import { LOANS_COLLECTION } from '../../loans/loanConstants';
import LoanService from '../../loans/server/LoanService';
import { Services } from '../../server';
import { assignAdminToUser } from '../../users/methodDefinitions';

// Pads a number with zeros: 4 --> 0004
const zeroPadding = (num, places) => {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
};

const getInsuranceRequestNameSuffix = loanId => {
  const loan = LoanService.get(loanId, { insuranceRequests: { name: 1 } });
  const [lastInsuranceRequest] =
    loan?.insuranceRequests
      ?.sort(({ name: a }, { name: b }) =>
        a.localeCompare(b, 'en', { numeric: true }),
      )
      .slice(-1) || [];

  if (!lastInsuranceRequest) {
    return '-A';
  }

  const { name } = lastInsuranceRequest;
  const [lastSuffixLetter] = name.split('-').slice(-1);

  if (lastSuffixLetter === 'Z') {
    throw new Error(
      'Le maximum de dossiers assurances liés à une hypothèque est de 26',
    );
  }

  const nextSuffixLetter = String.fromCharCode(
    lastSuffixLetter.charCodeAt(0) + 1,
  );
  return `-${nextSuffixLetter}`;
};

const getInsuranceNamePrefix = (insurances = []) => {
  if (insurances.length === 0) {
    return '01';
  }

  const [lastInsuranceName] = insurances
    .map(({ name }) => name)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .slice(-1);

  const lastInsurancePrefixNumber = parseInt(
    lastInsuranceName
      .split('-')
      .slice(-1)[0]
      .slice(1, 3),
    10,
  );

  const nextPrefixNumber = zeroPadding(lastInsurancePrefixNumber + 1, 2);

  return nextPrefixNumber;
};

const getNewBaseName = now => {
  const year = now.getYear();
  const yearPrefix = year - 100;
  const lastLoan = LoanService.get(
    {},
    { name: 1, $options: { sort: { name: -1 } } },
  );
  const lastInsuranceRequest = InsuranceRequestService.get(
    {},
    { name: 1, $options: { sort: { name: -1 } } },
  );

  if (!lastLoan && !lastInsuranceRequest) {
    return `${yearPrefix}-0001`;
  }

  const [lastName] = [lastLoan?.name, lastInsuranceRequest?.name]
    .filter(x => x)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .slice(-1);

  const [lastPrefix, count] = lastName
    .split('-')
    .map(numb => parseInt(numb, 10));

  if (lastPrefix !== yearPrefix) {
    return `${yearPrefix}-0001`;
  }

  const nextCountString = zeroPadding(count + 1, 4);

  return `${yearPrefix}-${nextCountString}`;
};

const getNewInsuranceName = insuranceRequestId => {
  const {
    name: insuranceRequestName,
    insurances = [],
  } = InsuranceRequestService.get(insuranceRequestId, {
    name: 1,
    insurances: { name: 1 },
  });

  return `${insuranceRequestName}${getInsuranceNamePrefix(insurances)}`;
};

const getNewLoanName = ({ insuranceRequestId, now }) => {
  if (insuranceRequestId) {
    const {
      name: insuranceRequestName,
    } = InsuranceRequestService.get(insuranceRequestId, { name: 1 });
    const loanName = insuranceRequestName
      .split('-')
      .slice(0, 2)
      .join('-');
    return loanName;
  }

  return getNewBaseName(now);
};

const getNewInsuranceRequestName = ({ loanId, now }) => {
  const nameSuffix = getInsuranceRequestNameSuffix(loanId);

  if (loanId) {
    const { name: loanName } = LoanService.get(loanId, { name: 1 });
    return `${loanName}${nameSuffix}`;
  }

  return `${getNewBaseName(now)}${nameSuffix}`;
};

export const getNewName = ({
  collection,
  loanId,
  insuranceRequestId,
  now = new Date(),
}) => {
  switch (collection) {
    case LOANS_COLLECTION:
      return getNewLoanName({ insuranceRequestId, now });
    case INSURANCE_REQUESTS_COLLECTION:
      return getNewInsuranceRequestName({ loanId, now });
    case INSURANCES_COLLECTION:
      return getNewInsuranceName(insuranceRequestId);
    default:
      return '';
  }
};

export const setAssignees = ({
  docId,
  collection,
  assignees,
  updateUserAssignee,
}) => {
  if (assignees.length < 1 || assignees.length > 3) {
    throw new Meteor.Error(
      'Il doit y avoir entre 1 et 3 conseillers sur un dossier',
    );
  }

  const total = assignees.reduce((t, v) => t + v.percent, 0);

  if (total !== 100) {
    throw new Meteor.Error('Les pourcentages doivent faire 100%');
  }

  const main = assignees.filter(a => a.isMain);

  if (main.length !== 1) {
    throw new Meteor.Error(
      "Il ne peut y avoir qu'un seul conseiller principal",
    );
  }

  let documents = [{ _id: docId, collection }];

  switch (collection) {
    case LOANS_COLLECTION: {
      const { insuranceRequestLinks = [] } = LoanService.get(docId, {
        insuranceRequestLinks: 1,
      });
      documents = [
        ...documents,
        ...insuranceRequestLinks.map(({ _id }) => ({
          _id,
          collection: INSURANCE_REQUESTS_COLLECTION,
        })),
      ];
      break;
    }
    case INSURANCE_REQUESTS_COLLECTION: {
      const loan = LoanService.get(
        { 'insuranceRequestLinks._id': docId },
        { _id: 1, insuranceRequestLinks: { _id: 1 } },
      );
      documents = [
        ...documents,
        loan && { _id: loan._id, collection: LOANS_COLLECTION },
        ...(loan?.insuranceRequestLinks?.length
          ? loan.insuranceRequestLinks
              .filter(({ _id }) => _id !== docId)
              .map(({ _id }) => ({
                _id,
                collection: INSURANCE_REQUESTS_COLLECTION,
              }))
          : []),
      ].filter(x => x);
      break;
    }
    default:
      break;
  }

  documents.forEach(({ _id, collection: docCollection }, index) => {
    const Service = Services[docCollection];
    let formattedAssignees;

    // Don't update main assignee for linked documents
    if (index === 0) {
      formattedAssignees = assignees;
    } else {
      const { assigneeLinks: currentAssignees = [] } = Service.get(_id, {
        assigneeLinks: 1,
      });
      if (!currentAssignees.length) {
        formattedAssignees = assignees;
      } else {
        const [currentMain] = currentAssignees.filter(a => a.isMain);
        const currentMainIsInAssignees = assignees.find(
          ({ _id: assigneeId }) => assigneeId === currentMain._id,
        );

        formattedAssignees = currentMainIsInAssignees
          ? assignees.map(assignee => {
              const isMain = assignee._id === currentMain._id;
              return { ...assignee, isMain };
            })
          : assignees;
      }
    }
    Service._update({
      id: _id,
      object: { assigneeLinks: formattedAssignees },
    });
  });

  if (updateUserAssignee) {
    const { user: { _id: userId } = {} } = Services[collection].get(docId, {
      user: { _id: 1 },
    });
    if (userId) {
      assignAdminToUser.run({ userId, adminId: main[0]._id });
    }
  }

  return Promise.resolve();
};

export const setAdminNote = function({ docId, adminNoteId, note, userId }) {
  let result;
  const now = new Date();
  const formattedNote = {
    ...note,
    updatedBy: userId,
    date: note.date || now,
  };

  if (formattedNote.date.getTime() > now.getTime()) {
    throw new Meteor.Error('Les dates dans le futur ne sont pas autorisées');
  }

  const { adminNotes: currentAdminNotes = [] } = this.get(docId, {
    adminNotes: 1,
  });

  let newAdminNotes = currentAdminNotes;

  const currentAdminNoteIndex = currentAdminNotes.findIndex(
    ({ id }) => id === adminNoteId,
  );

  if (currentAdminNoteIndex !== -1) {
    newAdminNotes.splice(currentAdminNoteIndex, 1);
    newAdminNotes = [...newAdminNotes, { ...formattedNote, id: adminNoteId }];
  } else {
    newAdminNotes = [...newAdminNotes, { ...formattedNote, id: Random.id() }];
  }

  newAdminNotes = newAdminNotes.sort(
    ({ date: a }, { date: b }) => new Date(b).getTime() - new Date(a).getTime(),
  );

  this._update({
    id: docId,
    object: { adminNotes: newAdminNotes },
  });

  this.updateProNote({ docId });

  return result;
};

export const removeAdminNote = function({ docId, adminNoteId }) {
  const result = this.baseUpdate(docId, {
    $pull: { adminNotes: { id: adminNoteId } },
  });

  this.updateProNote({ docId });

  return result;
};

export const updateProNote = function({ docId }) {
  const { adminNotes = [] } = this.get(docId, { adminNotes: 1 }) || {};
  const proNote = adminNotes.find(note => note.isSharedWithPros);

  if (proNote) {
    return this._update({ id: docId, object: { proNote } });
  }

  return this._update({
    id: docId,
    operator: '$unset',
    object: { proNote: true },
  });
};
