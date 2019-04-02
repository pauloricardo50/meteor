import { Migrations } from 'meteor/percolate:migrations';

import { Organisations } from '../..';

export const up = () => {
  const allOrganisations = Organisations.find().fetch();

  return Promise.all(allOrganisations.map((organisation) => {
    const { contactIds = [], userLinks = [] } = organisation;
    let promises = [];

    if (contactIds.length > 0) {
      const newContactIds = contactIds.map(({ role, ...contact }) => ({
        title: role,
        ...contact,
      }));
      promises = [
        Organisations.rawCollection().update(
          { _id: organisation._id },
          { $set: { contactIds: newContactIds } },
        ),
      ];
    }

    if (userLinks.length > 0) {
      const newUserLinks = userLinks.map(({ role, ...user }) => ({
        title: role,
        ...user,
      }));

      promises = [
        ...promises,
        Organisations.rawCollection().update(
          { _id: organisation._id },
          { $set: { userLinks: newUserLinks } },
        ),
      ];
    }

    if (promises.length > 0) {
      return Promise.all(promises);
    }

    return Promise.resolve();
  }));
};

export const down = () => {
  const allOrganisations = Organisations.find().fetch();

  return Promise.all(allOrganisations.map((organisation) => {
    const { contactIds = [], userLinks = [] } = organisation;
    let promises = [];

    if (contactIds.length > 0) {
      const newContactIds = contactIds.map(({ title, ...contact }) => ({
        role: title,
        ...contact,
      }));
      promises = [
        Organisations.rawCollection().update(
          { _id: organisation._id },
          { $set: { contactIds: newContactIds } },
        ),
      ];
    }

    if (userLinks.length > 0) {
      const newUserLinks = userLinks.map(({ title, ...user }) => ({
        role: title,
        ...user,
      }));

      promises = [
        ...promises,
        Organisations.rawCollection().update(
          { _id: organisation._id },
          { $set: { userLinks: newUserLinks } },
        ),
      ];
    }

    if (promises.length > 0) {
      return Promise.all(promises);
    }

    return Promise.resolve();
  }));
};

Migrations.add({
  version: 6,
  name:
    'Rename role into title in organisations userLinks and contactIds metadata',
  up,
  down,
});
