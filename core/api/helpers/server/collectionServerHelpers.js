import { Meteor } from 'meteor/meteor';

import { Services } from '../../server/index';
import { assignAdminToUser } from '../../users/index';
import LoanService from '../../loans/server/LoanService';
import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';
import { LOANS_COLLECTION } from '../../loans/loanConstants';
import { INSURANCE_REQUESTS_COLLECTION } from '../../insuranceRequests/insuranceRequestConstants';

// Pads a number with zeros: 4 --> 0004
const zeroPadding = (num, places) => {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
};

export const getNewName = ({ collection, now = new Date() }) => {
  const NAME_SUFFIX = {
    [LOANS_COLLECTION]: '',
    [INSURANCE_REQUESTS_COLLECTION]: '-A',
  };
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
    return `${yearPrefix}-0001${NAME_SUFFIX[collection]}`;
  }

  const lastName = [lastLoan?.name, lastInsuranceRequest?.name]
    .filter(x => x)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .slice(-1);

  const [lastPrefix, count] = lastName
    .split('-')
    .map(numb => parseInt(numb, 10));

  if (lastPrefix !== yearPrefix) {
    return `${yearPrefix}-0001${NAME_SUFFIX[collection]}`;
  }

  const nextCountString = zeroPadding(count + 1, 4);

  return `${yearPrefix}-${nextCountString}${NAME_SUFFIX[collection]}`;
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

  const Service = Services[collection];

  const response = Service.update({
    id: docId,
    object: { assigneeLinks: assignees },
  });

  if (updateUserAssignee) {
    const { user: { _id: userId } = {} } = Service.get(docId, {
      user: { _id: 1 },
    });
    if (userId) {
      assignAdminToUser.run({ userId, adminId: main[0]._id });
    }
  }

  return response;
};
