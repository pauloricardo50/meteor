import React, { useEffect, useState } from 'react';
import { StylesProvider } from '@material-ui/core/styles';

import LibraryWrappers from '../core/components/BaseRouter/LibraryWrappers';
import messages from '../core/lang/fr.json';
import {
  getFormats,
  getUserLocale,
} from '../core/utils/localization';
import FrontContact from './FrontContact/FrontContact';
import FrontContactSelect from './FrontContactSelect';

const { Front } = window;

localizationStartup({ setupAccounts: false, setupCountries: false });

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
  const [tagIds, setTagIds] = useState([]);

  useEffect(() => {
    Front.setPanelWidth(500);

    Front.on('conversation', frontData => {
      const {
        contact: frontContact,
        conversation: { tag_ids: frontTags = [] } = {},
      } = frontData;
      setContact(frontContact);
      setData(frontData);
      setTagIds(frontTags);
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
            tagIds={tagIds}
            setTagIds={setTagIds}
          />
        </div>
      </LibraryWrappers>
    </StylesProvider>
  );
};

export default FrontPlugin;
