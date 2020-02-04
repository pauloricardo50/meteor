// @flow
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import EpotekFrontApi from '../EpotekFrontApi';

const { Front } = window;

const fragment = {
  name: 1,
  email: 1,
  phoneNumbers: 1,
  address1: 1,
  address2: 1,
  city: 1,
  zipCode: 1,
};

const FrontContact = ({ contact: { handle, display_name } }) => {
  const [loading, setLoading] = useState(true);
  const [epotekContact, setEpotekContact] = useState();
  const [collection, setCollection] = useState();
  let contact = epotekContact;

  useEffect(() => {
    EpotekFrontApi.queryOne('users', {
      $filters: { 'emails.0.address': handle },
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
            $filters: { 'emails.0.address': handle },
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

  if (!epotekContact) {
    contact = { name: display_name || handle };
  }

  return (
    <div>
      <h3
        className={cx('text-center', { link: !!epotekContact })}
        onClick={() => {
          if (epotekContact) {
            Front.openUrl(
              `https://admin.e-potek.ch/${collection}/${epotekContact._id}`,
            );
          }
        }}
      >
        {contact.name}
      </h3>
      <span className="secondary" />
    </div>
  );
};

export default FrontContact;
