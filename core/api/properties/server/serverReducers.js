import FileService from '../../files/server/FileService';
import Properties from '../properties';
import { createMeteorAsyncFunction } from '../../helpers';

Properties.addReducers({
  documents: {
    body: {
      _id: 1,
    },
    reduce({ _id: propertyId }) {
      const asyncFunc = createMeteorAsyncFunction(FileService.listFilesForDocByCategory);
      return asyncFunc(propertyId);
    },
  },
});
