import FileService from '../../files/server/FileService';
import Promotions from '../promotions';
import formatNumbersHook, {
  formatPhoneNumber,
} from '../../../utils/phoneFormatting';

Promotions.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id),
);

formatNumbersHook(Promotions, 'contacts', oldContacts =>
  oldContacts.map(contact => ({
    ...contact,
    phoneNumber: formatPhoneNumber(contact.phoneNumber),
  })),
);
