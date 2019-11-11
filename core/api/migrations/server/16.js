import { Migrations } from 'meteor/percolate:migrations';

import { Users, Contacts } from '../..';
import { formatPhoneNumber } from '../../../utils/phoneFormatting';

export const up = async () => {
  const allUsers = Users.find({}, { fields: { phoneNumbers: 1 } }).fetch();
  const allContacts = Contacts.find(
    {},
    { fields: { phoneNumbers: 1 } },
  ).fetch();

  await Promise.all(
    allUsers.map(({ _id, phoneNumbers = [] }) =>
      Users.rawCollection().update(
        { _id },
        { $set: { phoneNumbers: phoneNumbers.map(formatPhoneNumber) } },
      ),
    ),
  );

  await Promise.all(
    allContacts.map(({ _id, phoneNumbers = [] }) =>
      Contacts.rawCollection().update(
        { _id },
        { $set: { phoneNumbers: phoneNumbers.map(formatPhoneNumber) } },
      ),
    ),
  );
};

// Do nothing, can't go back!
export const down = () => {};

Migrations.add({
  version: 16,
  name: 'Format all phone numbers',
  up,
  down,
});
