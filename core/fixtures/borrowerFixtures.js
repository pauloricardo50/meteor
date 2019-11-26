import faker from 'faker/locale/fr';

import BorrowerService from '../api/borrowers/server/BorrowerService';
import { completeFakeBorrower } from '../api/borrowers/fakes';

const insertFakeBorrower = userId => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  const borrower = {
    ...completeFakeBorrower,
    firstName,
    lastName,
    address1: faker.address.streetAddress(),
    company: faker.company.companyName(),
  };

  return BorrowerService.insert({ borrower, userId });
};

export const createFakeBorrowers = (userId, twoBorrowers = false) => {
  const borrowerIds = [insertFakeBorrower(userId)];
  if (twoBorrowers) {
    borrowerIds.push(insertFakeBorrower(userId));
  }
  return borrowerIds;
};

export const getRelatedBorrowerIds = usersIds =>
  BorrowerService.fetch({
    $filters: { userId: { $in: usersIds } },
    _id: 1,
  }).map(item => item._id);
