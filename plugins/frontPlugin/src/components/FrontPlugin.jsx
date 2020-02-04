import React, { useEffect, useState } from 'react';
import FrontContact from './FrontContact';
import LibraryWrappers from '../core/components/BaseRouter/LibraryWrappers';
import {
  getFormats,
  localizationStartup,
  getUserLocale,
} from '../core/utils/localization';
import messages from '../core/lang/fr.json';

const { Front } = window;
console.log('Front:', Front);
localizationStartup({ setupAccounts: false, setupCountries: false, messages });

const FrontPlugin = () => {
  const [data, setData] = useState(null);
  console.log('conversation:', data);

  useEffect(() => {
    Front.setPanelWidth(500);

    Front.on('conversation', setData);

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

  const { conversation, contact, message, otherMessages } = data;

  return (
    <LibraryWrappers
      i18n={{ messages, formats: getFormats(), locale: getUserLocale() }}
    >
      <div className="front-plugin">
        <FrontContact contact={contact} key={conversation.id} />
      </div>
    </LibraryWrappers>
  );
};

export default FrontPlugin;
