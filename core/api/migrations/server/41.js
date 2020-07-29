import { Migrations } from 'meteor/percolate:migrations';

import {
  LOAN_STATUS,
  UNSUCCESSFUL_LOAN_REASONS,
} from '../../loans/loanConstants';
import UserService from '../../users/server/UserService';
import { ROLES, USER_STATUS } from '../../users/userConstants';

export const up = () => {
  const users = UserService.fetch({
    $filters: { 'roles._id': ROLES.USER },
    loans: { status: 1, unsuccessfulReason: 1 },
  });

  return Promise.all(
    users.map(user => {
      const { loans = [] } = user;
      const hasOnlyUnsuccessfulLoans =
        !!loans.length &&
        !loans.some(({ status }) => status !== LOAN_STATUS.UNSUCCESSFUL);
      const shouldBeLost =
        hasOnlyUnsuccessfulLoans &&
        loans.every(({ unsuccessfulReason }) =>
          [
            UNSUCCESSFUL_LOAN_REASONS.CONTACT_LOSS_NO_ANSWER,
            UNSUCCESSFUL_LOAN_REASONS.CONTACT_LOSS_UNREACHABLE,
          ].includes(unsuccessfulReason),
        );

      const status = shouldBeLost ? USER_STATUS.LOST : USER_STATUS.QUALIFIED;

      return UserService.rawCollection.update(
        { _id: user._id },
        { $set: { status } },
      );
    }),
  );
};

export const down = () => {
  const users = UserService.fetch({
    $filters: { 'roles._id': ROLES.USER },
    _id: 1,
  });

  return Promise.all(
    users.map(({ _id }) =>
      UserService.rawCollection.update({ _id }, { $unset: { status: true } }),
    ),
  );
};

Migrations.add({
  version: 41,
  name: 'Initialize user status',
  up,
  down,
});
