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

const getContactSubtitle = ({ collection, epotekContact, contact }) => {
  if (!epotekContact) {
    const { source } = contact;
    return source.charAt(0).toUpperCase() + source.slice(1);
  }

  const { roles } = epotekContact;

  if (collection === 'contacts') {
    return 'Contact e-Potek';
  }

  switch (roles[0]) {
    case 'user':
      return 'Client(e) e-Potek';
    case 'dev':
      return 'Dev e-Potek';
    case 'admin':
      return 'Admin e-Potek';
    case 'pro':
      return 'Pro e-Potek';

    default:
      return '';
  }
};

const FrontContact = ({ contact }) => {
  const { handle, display_name } = contact;
  const [loading, setLoading] = useState(true);
  const [epotekContact, setEpotekContact] = useState();
  const [collection, setCollection] = useState();
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

  if (!epotekContact) {
    finalContact = { name: display_name || handle };
  }

  return (
    <div className="text-center">
      <div
        className={cx('flex', { link: !!epotekContact })}
        style={{ justifyContent: 'center' }}
        onClick={() => {
          if (epotekContact) {
            Front.openUrl(
              `https://admin.e-potek.ch/${collection}/${epotekContact._id}`,
            );
          }
        }}
      >
        {!!epotekContact && (
          <img
            src="https://backend.e-potek.ch/img/logo_square_black.svg"
            style={{ width: 24, height: 24, marginRight: 8 }}
          />
        )}
        <h3 style={{ margin: 0, marginBottom: 8 }}>{finalContact.name}</h3>
      </div>
      <span className="secondary">
        {getContactSubtitle({ collection, contact, epotekContact })}
      </span>
    </div>
  );
};

export default FrontContact;
