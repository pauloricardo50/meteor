import FileService from '../../files/server/FileService';
import Loans from '../loans';
import { createMeteorAsyncFunction } from '../../helpers';

Loans.addReducers({
  documents: {
    body: {
      _id: 1,
    },
    reduce({ _id: loanId }) {
      const asyncFunc = createMeteorAsyncFunction(FileService.listFilesForDocByCategory);
      return asyncFunc(loanId);
    },
  },
});
