import { useEffect, useState } from 'react';
import { withProps } from 'recompose';

import EpotekFrontApi from '../../EpotekFrontApi';

const contactFragment = email => ({
  $filters: { 'emails.0.address': { $in: [email, email.toLowerCase()] } },
  address1: 1,
  address2: 1,
  city: 1,
  createdAt: 1,
  email: 1,
  name: 1,
  phoneNumbers: 1,
  zipCode: 1,
});

const taskFragment = {
  $filters: { status: 'ACTIVE' },
  assignee: { name: 1 },
  description: 1,
  dueAt: 1,
  title: 1,
};

export default withProps(({ contact }) => {
  const { handle, display_name } = contact;
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [epotekContact, setEpotekContact] = useState();
  const [collection, setCollection] = useState();
  const isEpotekResource = !!epotekContact;
  let finalContact = epotekContact;

  const refetch = () => {
    EpotekFrontApi.queryOne('users', {
      ...contactFragment(handle),
      assignedEmployee: { name: 1 },
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
      loans: {
        name: 1,
        status: 1,
        tasks: taskFragment,
        category: 1,
        mainAssignee: 1,
      },
      tasks: taskFragment,
      roles: 1,
      organisations: { name: 1 },
      acquisitionChannel: 1,
    })
      .then(result => {
        if (result._id) {
          setEpotekContact({ ...contact, ...result });
          setCollection('users');
        } else {
          return EpotekFrontApi.queryOne(
            'contacts',
            contactFragment(handle),
          ).then(result2 => {
            if (result2._id) {
              setEpotekContact({ ...contact, ...result2 });
              setCollection('contacts');
            }
          });
        }
      })
      .then(() => setLoading(false))
      .catch(e => {
        setLoading(false);
        setError(e);
      });
  };

  useEffect(refetch, []);

  if (!isEpotekResource) {
    finalContact = { ...contact, email: handle, name: display_name || handle };
  }

  return {
    loading,
    error,
    isEpotekResource,
    finalContact,
    collection,
    refetch,
  };
});
