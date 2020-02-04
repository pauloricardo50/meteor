import React from 'react';
import moment from 'moment';
import cx from 'classnames';

const { Front } = window;

const getContactSubtitle = ({ collection, isEpotekContact, contact }) => {
  if (!isEpotekContact) {
    const { source } = contact;
    return source.charAt(0).toUpperCase() + source.slice(1);
  }

  const { roles } = contact;

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

const FrontContactHeader = ({ collection, contact, isEpotekContact }) => (
  <div className="text-center">
    <div
      className={cx('flex', { link: isEpotekContact })}
      style={{ justifyContent: 'center' }}
      onClick={() => {
        if (isEpotekContact) {
          Front.openUrl(
            `https://admin.e-potek.ch/${collection}/${contact._id}`,
          );
        }
      }}
    >
      {isEpotekContact && (
        <img
          src="https://backend.e-potek.ch/img/logo_square_black.svg"
          style={{ width: 24, height: 24, marginRight: 8 }}
          alt="logo"
        />
      )}
      <h3 style={{ margin: 0, marginBottom: 8 }}>{contact.name}</h3>
    </div>
    <span className="secondary">
      <span>
        {getContactSubtitle({ collection, contact, isEpotekContact })}
      </span>
      {isEpotekContact && (
        <span>
          {' '}
          depuis{' '}
          {
            moment(contact.createdAt)
              .fromNow()
              .split('il y a')[1]
          }
        </span>
      )}
    </span>
  </div>
);

export default FrontContactHeader;
