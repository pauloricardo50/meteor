import PromotionReservations from '../promotionReservations';
import FileService from '../../files/server/FileService';

PromotionReservations.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id));
