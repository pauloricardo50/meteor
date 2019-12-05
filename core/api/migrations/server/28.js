import { Random } from 'meteor/random';
import { Migrations } from 'meteor/percolate:migrations';

import { employeesByEmail } from 'core/arrays/epotekEmployees';
import LoanService from '../../loans/server/LoanService';

export const up = () => {
  const allLoans = LoanService.fetch({
    $filters: {
      adminNote: { $exists: true },
      $expr: { $gt: [{ $strLenCP: '$adminNote' }, 0] }, // Get strings longer than 0 chars
    },
    adminNote: 1,
    user: { assignedEmployeeId: 1 },
  });

  return Promise.all(
    allLoans.map(({ _id, adminNote, user }) => {
      const [adminNote1, ...otherNotes] = adminNote.split('\n');

      const adminNotes = [adminNote1, otherNotes.join('\n')]
        .filter(x => x)
        .map(note => ({
          note,
          id: Random.id(),
          updatedBy:
            (user && user.assignedEmployeeId) ||
            employeesByEmail['yannis@e-potek.ch']._id,
          date: new Date(),
          isSharedWithPros: false,
        }));

      return LoanService.rawCollection.update(
        { _id },
        { $set: { adminNotes }, $unset: { adminNote: true } },
      );
    }),
  );
};

export const down = () => {
  const allLoans = LoanService.fetch({
    $filters: { $where: 'this.adminNotes.length > 0' },
    adminNotes: 1,
  });

  return Promise.all(
    allLoans.map(({ _id, adminNotes }) =>
      LoanService.rawCollection.update(
        { _id },
        {
          $set: { adminNote: adminNotes.map(({ note }) => note).join('\n') },
          $unset: { adminNotes: true },
        },
      ),
    ),
  );
};

Migrations.add({
  version: 28,
  name: 'Migrate adminNote to adminNotes',
  up,
  down,
});
