import React, { useEffect, useState } from 'react';
import { StylesProvider } from '@material-ui/core/styles';

import FrontContact from './FrontContact/FrontContact';
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

const FrontPlugin = ({ resetError }) => {
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
      resetError();
    });
  }, []);

  if (!data) {
    return (
      <div>
        <h2 className="secondary">Pas de conversation choisie</h2>
      </div>
    );
  }

  return (
    <StylesProvider injectFirst>
      <LibraryWrappers
        i18n={{ messages, formats: getFormats(), locale: getUserLocale() }}
      >
        <div className="front-plugin">
          <FrontContactSelect
            contact={contact}
            contacts={getContacts(data)}
            setContact={setContact}
          />
          <FrontContact
            contact={contact}
            key={contact.handle}
            conversation={data.conversation}
          />
        </div>
      </LibraryWrappers>
    </StylesProvider>
  );
};

export default FrontPlugin;
