import { Migrations } from 'meteor/percolate:migrations';

import { ACTIVITY_TYPES } from '../../activities/activityConstants';
import ActivityService from '../../activities/server/ActivityService';
import LoanService from '../../loans/server/LoanService';

export const up = async () => {
  const allLoans = LoanService.fetch({
    createdAt: 1,
    closingDate: 1,
    signingDate: 1,
    user: { assignedEmployeeId: 1 },
  });

  await Promise.all(
    allLoans.map(({ createdAt, _id, signingDate, closingDate, user = {} }) => {
      const assignee = user.assignedEmployeeId;
      ActivityService.addCreatedAtActivity({
        createdAt,
        loanLink: { _id },
        title: 'Dossier créé',
      });

      if (signingDate) {
        ActivityService.insert({
          title: 'Signature',
          date: signingDate,
          type: ACTIVITY_TYPES.EVENT,
          createdBy: assignee,
          loanLink: { _id },
        });
      }

      if (closingDate) {
        ActivityService.insert({
          title: 'Closing',
          date: closingDate,
          type: ACTIVITY_TYPES.EVENT,
          createdBy: assignee,
          loanLink: { _id },
        });
      }

      LoanService.baseUpdate(_id, {
        $unset: { closingDate: 1, signingDate: 1 },
      });
    }),
  );
};

// No need to migrate back
export const down = () => {};

Migrations.add({
  version: 17,
  name: 'Add activities and remove closing + signing dates',
  up,
  down,
});
