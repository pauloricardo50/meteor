import { exposeQuery } from '../../queries/queryHelpers';
import { loanGoogleDriveFiles } from '../queries';
import { getLoanGoogleDriveFiles } from './resolvers';

exposeQuery({
  query: loanGoogleDriveFiles,
  overrides: {
    validateParams: { loanId: String },
  },
  resolver: getLoanGoogleDriveFiles,
});
