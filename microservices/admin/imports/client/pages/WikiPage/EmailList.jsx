import { Meteor } from 'meteor/meteor';

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

const EmailList = () => {
  const { formatMessage: f } = useIntl();
  const [listenerData, setListeners] = useState([]);

  useEffect(() => {
    Meteor.call('getEmailListeners', (err, res) => {
      const data = Object.keys(res)
        .map(methodName => {
          const listeners = res[methodName];
          return {
            name: f({ id: `methods.${methodName}` }),
            listeners,
          };
        })
        .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB));
      setListeners(data);
    });
  }, []);

  return (
    <div>
      <h3>Emails automatiques</h3>

      {listenerData.map(({ name, listeners }) => (
        <div key={name}>
          <h4>
            {name} - ({listeners.length})
          </h4>
          <ul>
            {listeners.map((listener, index) => (
              <li key={index}>{listener}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default EmailList;
