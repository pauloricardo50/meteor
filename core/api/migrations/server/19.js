import { Migrations } from 'meteor/percolate:migrations';

import Revenues from '../../revenues';

export const up = async () => {
  const allRevenues = Revenues.find({}).fetch();

  return Promise.all(allRevenues.map(({ _id, organisationLinks }) =>
    Revenues.rawCollection().update(
      { _id },
      {
        $set: {
          organisationLinks: organisationLinks.map(({ paidDate, ...link }) => ({
            ...link,
            paidAt: paidDate,
          })),
        },
      },
    )));
};

export const down = async () => {
  const allRevenues = Revenues.find({}).fetch();

  return Promise.all(allRevenues.map(({ _id, organisationLinks }) =>
    Revenues.rawCollection().update(
      { _id },
      {
        $set: {
          organisationLinks: organisationLinks.map(({ paidAt, ...link }) => ({
            ...link,
            paidDate: paidAt,
          })),
        },
      },
    )));
};

Migrations.add({
  version: 19,
  name: 'Use paidAt instead of paidDate of consistency',
  up,
  down,
});
