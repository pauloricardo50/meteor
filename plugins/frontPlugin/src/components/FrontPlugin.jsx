import React, { useEffect, useState } from 'react';
import FrontContact from './FrontContact';

const { Front } = window;
console.log('Front:', Front);

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
    <div className="front-plugin">
      <FrontContact contact={contact} key={conversation.id} />
    </div>
  );
};

export default FrontPlugin;
