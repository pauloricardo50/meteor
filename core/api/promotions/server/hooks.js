import FileService from '../../files/server/FileService';
import Promotions from '../promotions';
import formatNumbersHook, {
  formatPhoneNumber,
} from '../../../utils/phoneFormatting';

Promotions.after.remove((userId, { _id }) =>
  FileService.deleteAllFilesForDoc(_id));

formatNumbersHook(Promotions, 'contacts', ({ modifier }) => {
  modifier.$set.contacts = modifier.$set.contacts.map(contact => ({
    ...contact,
    phoneNumber: formatPhoneNumber(contact.phoneNumber),
  }));
});
