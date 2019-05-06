import FileService from '../../files/server/FileService';
import Promotions from '../promotions';

Promotions.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id));
