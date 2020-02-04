// @flow
import React, { useEffect, useState } from 'react';
import EpotekFrontApi from '../EpotekFrontApi';
import FrontContactHeader from './FrontContactHeader';
import FrontContactLoans from './FrontContactLoans';

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
  title: 1,
  dueAt: 1,
  assignee: { name: 1 },
};

const FrontContact = ({ contact }) => {
  const { handle, display_name } = contact;
  const [loading, setLoading] = useState(true);
  const [epotekContact, setEpotekContact] = useState();
  const [collection, setCollection] = useState();
  const isEpotekResource = !!epotekContact;
  let finalContact = epotekContact;

  useEffect(() => {
    EpotekFrontApi.queryOne('users', {
      ...contactFragment(handle),
      assignedEmployee: { name: 1 },
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
      loans: {
        name: 1,
        status: 1,
        tasks: taskFragment,
      },
      tasks: taskFragment,
      roles: 1,
    })
      .then(result => {
        if (result._id) {
          setEpotekContact(result);
          setCollection('users');
        } else {
          return EpotekFrontApi.queryOne(
            'contacts',
            contactFragment(handle),
          ).then(result2 => {
            if (result2._id) {
              setEpotekContact(result2);
              setCollection('contacts');
            }
          });
        }
      })
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <i>Loading...</i>
      </div>
    );
  }

  if (!isEpotekResource) {
    finalContact = { ...contact, name: display_name || handle };
  }
  console.log('finalContact:', finalContact);

  return (
    <div>
      <FrontContactHeader
        isEpotekResource={isEpotekResource}
        contact={finalContact}
        collection={collection}
      />

      {isEpotekResource && collection === 'users' && (
        <FrontContactLoans loans={finalContact.loans} />
      )}
    </div>
  );
};

export default FrontContact;
