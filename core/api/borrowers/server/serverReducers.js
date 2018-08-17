import FileService from '../../files/server/FileService';
import Borrowers from '../borrowers';
import { createMeteorAsyncFunction } from '../../helpers';

Borrowers.addReducers({
  documents: {
    body: {
      _id: 1,
    },
    reduce({ _id: borrowerId }) {
      const asyncFunc = createMeteorAsyncFunction(FileService.listFilesForDocByCategory);
      return asyncFunc(borrowerId);
    },
  },
});
