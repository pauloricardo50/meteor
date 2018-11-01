import FileService from '../files/server/FileService';
import { createMeteorAsyncFunction } from '../helpers';

const filesReducer = {
  documents: {
    body: { _id: 1 },
    reduce({ _id }) {
      const asyncFunc = createMeteorAsyncFunction(FileService.listFilesForDocByCategory);
      return asyncFunc(_id);
    },
  },
};

export default filesReducer;
