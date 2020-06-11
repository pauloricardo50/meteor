import formatNumbersHook, {
  formatPhoneNumber,
} from '../../../utils/phoneFormatting';
import FileService from '../../files/server/FileService';
import Promotions from '../promotions';

Promotions.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id),
);

formatNumbersHook(Promotions, 'contacts', oldContacts =>
  oldContacts.map(({ phoneNumber, ...contact }) => ({
    ...contact,
    phoneNumber: formatPhoneNumber(phoneNumber),
  })),
);
