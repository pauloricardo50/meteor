import PromotionReservations from '../PromotionReservations';
import FileService from '../../files/server/FileService';

PromotionReservations.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id));
