// server code only
import { Loans, Properties, Borrowers, Users } from 'core/api';
import searchDatabase from './searchDatabase';

searchDatabase.expose();

searchDatabase.resolve(({ searchQuery }) => {
  const loans = Loans.find(
    { name: { $regex: searchQuery } },
    {
      fields: {
        _id: 1,
        name: 1,
        createdAt: 1,
        updatedAt: 1,
        logic: 1,
        general: 1,
      },
    },
  ).fetch();

  const properties = Properties.find(
    {
      $or: [
        { address1: { $regex: searchQuery } },
        { city: { $regex: searchQuery } },
      ],
    },
    {
      fields: {
        _id: 1,
        address1: 1,
        address2: 1,
        city: 1,
        zipCode: 1,
        value: 1,
        status: 1,
        style: 1,
        insideArea: 1,
      },
    },
  ).fetch();

  const borrowers = Borrowers.find(
    {
      $or: [
        { firstName: { $regex: searchQuery } },
        { lastName: { $regex: searchQuery } },
      ],
    },
    {
      fields: { _id: 1, firstName: 1, lastName: 1, createdAt: 1, updatedAt: 1 },
    },
  ).fetch();

  const users = Users.find(
    {
      $or: [
        {
          emails: {
            $elemMatch: {
              address: {
                $regex: searchQuery,
              },
            },
          },
        },
        { 'profile.organization': { $regex: searchQuery } },
      ],
    },
    {
      fields: {
        _id: 1,
        emails: 1,
        profile: 1,
        roles: 1,
        createdAt: 1,
        assignedEmployeeId: 1,
      },
    },
  ).fetch();

  return { loans, properties, borrowers, users };
});
