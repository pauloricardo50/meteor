import React, { useEffect, useState } from 'react';
import FrontContact from './FrontContact';
import FrontContactSelect from './FrontContactSelect';
import LibraryWrappers from '../core/components/BaseRouter/LibraryWrappers';
import {
  getFormats,
  localizationStartup,
  getUserLocale,
} from '../core/utils/localization';
import messages from '../core/lang/fr.json';

const { Front } = window;

localizationStartup({ setupAccounts: false, setupCountries: false, messages });

const getContacts = data => {
  const {
    contact,
    message: { recipients: messageRecipients = [] } = {},
    otherMessages = [],
  } = data;
  return [
    contact,
    ...messageRecipients,
    ...otherMessages.reduce(
      (otherRecipients, { recipients = [] }) => [
        ...otherRecipients,
        ...recipients,
      ],
      [],
    ),
  ].filter(
    ({ handle }, index, array) =>
      handle !== Front.user.email &&
      array.findIndex(({ handle: h }) => h === handle) === index,
  );
};

const FrontPlugin = () => {
  const [data, setData] = useState(null);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    Front.setPanelWidth(500);

    Front.on('conversation', frontData => {
      const { contact: frontContact } = frontData;
      setContact(frontContact);
      setData(frontData);
    });

    Front.on('no_conversation', () => {
      setData(null);
    });

    Front.on('panel_visible', isVisible => {
      if (isVisible) {
        // Reload any existing queries
      }
    });
  }, []);

  if (!data) {
    return <div>Pas de conversation choisie</div>;
  }

  return (
    <LibraryWrappers
      i18n={{ messages, formats: getFormats(), locale: getUserLocale() }}
    >
      <div className="front-plugin">
        <FrontContactSelect
          contact={contact}
          contacts={getContacts(data)}
          setContact={setContact}
        />
        <FrontContact contact={contact} key={contact.handle} />
      </div>
    </LibraryWrappers>
  );
};

export default FrontPlugin;
