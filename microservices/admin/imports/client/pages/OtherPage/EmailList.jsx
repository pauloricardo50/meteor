// @flow
import { Meteor } from 'meteor/meteor';

import React, { useState, useEffect } from 'react';

type EmailListProps = {};

const EmailList = (props: EmailListProps) => {
  const [listenerData, setListeners] = useState();

  useEffect(() => {
    Meteor.call('getEmailListeners', (err, res) => {
      setListeners(res);
    });
  }, []);

  return (
    <div>
      <h3>Emails automatiques</h3>
      {listenerData && (
        <>
          {Object.keys(listenerData).map(methodName => {
            const listeners = listenerData[methodName];
            return (
              <div key={methodName}>
                <h4>
                  {methodName} - ({listeners.length})
                </h4>
                <ul>
                  {listeners.map((listener, index) => (
                    <li key={index}>{listener}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default EmailList;
