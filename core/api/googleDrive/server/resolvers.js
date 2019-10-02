import LoanService from '../../loans/server/LoanService';
import GoogleDriveService from './GoogleDriveService';

export const getLoanGoogleDriveFiles = ({ loanId }) => {
  const service = new GoogleDriveService();
  const { name } = LoanService.fetchOne({ $filters: { _id: loanId }, name: 1 });

  return service.listFilesForFolder({ prefix: name });
};
