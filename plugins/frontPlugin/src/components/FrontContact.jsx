// @flow
import React, { useEffect, useState } from 'react';
import EpotekFrontApi from '../EpotekFrontApi';
import FrontContactHeader from './FrontContactHeader';

const fragment = {
  address1: 1,
  address2: 1,
  city: 1,
  createdAt: 1,
  email: 1,
  name: 1,
  phoneNumbers: 1,
  zipCode: 1,
};

const FrontContact = ({ contact }) => {
  const { handle, display_name } = contact;
  const [loading, setLoading] = useState(true);
  const [epotekContact, setEpotekContact] = useState();
  const [collection, setCollection] = useState();
  const isEpotekContact = !!epotekContact;
  let finalContact = epotekContact;

  useEffect(() => {
    EpotekFrontApi.queryOne('users', {
      $filters: { 'emails.0.address': handle.toLowerCase() },
      assignedEmployee: { name: 1 },
      roles: 1,
      ...fragment,
    })
      .then(result => {
        if (result._id) {
          setEpotekContact(result);
          setCollection('users');
        } else {
          return EpotekFrontApi.queryOne('contacts', {
            $filters: { 'emails.0.address': handle.toLowerCase() },
            ...fragment,
          }).then(result2 => {
            if (result2._id) {
              setEpotekContact(result2);
              setCollection('contacts');
            }
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <i>Loading...</i>
      </div>
    );
  }

  if (!isEpotekContact) {
    finalContact = { ...contact, name: display_name || handle };
  }

  return (
    <FrontContactHeader
      isEpotekContact={isEpotekContact}
      contact={finalContact}
      collection={collection}
    />
  );
};

export default FrontContact;
