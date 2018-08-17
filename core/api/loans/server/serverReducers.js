import FileService from '../../files/server/FileService';
import Loans from '../loans';
import { createMeteorAsyncFunction } from '../../helpers';

Loans.addReducers({
  files: {
    body: {
      _id: 1,
      borrowerIds: 1,
      propertyIds: 1,
    },
    reduce({ _id: loanId, propertyIds, borrowerIds }) {
      const asyncFunc = createMeteorAsyncFunction(FileService.listFilesForDocByCategory);
      return asyncFunc(propertyIds[0]);
    },
  },
});
