import ActivityService from '../../activities/server/ActivityService';
import BorrowerService from '../../borrowers/server/BorrowerService';
import FileService from '../../files/server/FileService';
import InsuranceRequests from '..';

InsuranceRequests.before.remove((userId, { borrowerLinks }) => {
  borrowerLinks.forEach(({ _id: borrowerId }) =>
    BorrowerService.cleanUpBorrowers({ borrowerId }),
  );
});

InsuranceRequests.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id),
);

InsuranceRequests.after.insert((userId, doc) =>
  ActivityService.addCreatedAtActivity({
    createdAt: doc.createdAt,
    insuranceRequestLink: { _id: doc._id },
    title: 'Dossier créé',
  }),
);
