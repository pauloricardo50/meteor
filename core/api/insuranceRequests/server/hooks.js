import BorrowerService from '../../borrowers/server/BorrowerService';
import FileService from '../../files/server/FileService';
import ActivityService from '../../activities/server/ActivityService';
import InsuranceRequests from '..';

InsuranceRequests.before.remove((userId, { borrowerLinks }) => {
  borrowerLinks.forEach(({ _id: borrowerId }) => {
    const { insuranceRequests = [], loans = [] } = BorrowerService.createQuery({
      $filters: { id: borrowerId },
      loans: { _id: 1 },
      insuranceRequests: { _id: 1 },
    }).fetchOne();
    const hasOneLoan = loans.length === 1;
    const hasOneInsuranceRequest = insuranceRequests.length === 1;

    if (hasOneLoan ? !hasOneInsuranceRequest : hasOneInsuranceRequest) {
      BorrowerService.remove({ borrowerId });
    }
  });
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
