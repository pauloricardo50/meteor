import FileService from '../../files/server/FileService';
import Organisations from '../organisations';

Organisations.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id),
);
