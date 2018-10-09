import FileService from '../../files/server/FileService';
import Promotions from '../promotions';
import { createMeteorAsyncFunction } from '../../helpers';

Promotions.addReducers({
  documents: {
    body: { _id: 1 },
    reduce({ _id: promotionId }) {
      const asyncFunc = createMeteorAsyncFunction(FileService.listFilesForDocByCategory);
      return asyncFunc(promotionId);
    },
  },
});
