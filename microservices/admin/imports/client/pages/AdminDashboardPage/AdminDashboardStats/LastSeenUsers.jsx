//      
import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { ROLES, USERS_COLLECTION } from 'core/api/constants';
import Select from 'core/components/Select';
import T from 'core/components/Translation';
import Loading from 'core/components/Loading';
import DialogSimple from 'core/components/DialogSimple';
import { CollectionIconLink } from 'core/components/IconLink';
import MixpanelService from 'core/utils/mixpanel';

                             

const mapUser = ({ $properties: { $name, $last_seen, id } }) => (
  <div key={id} className="flex center-align flex--sb">
    <CollectionIconLink
      relatedDoc={{
        _id: id,
        name: $name,
        collection: USERS_COLLECTION,
      }}
    />
    <span> {moment($last_seen).fromNow()}</span>
  </div>
);

const LastSeenUsers = (props                    ) => {
  const [role, setRole] = useState(ROLES.USER);
  const [lastSeenUsers, setLastSeenUsers] = useState(null);
  useEffect(() => {
    setLastSeenUsers(null);
    MixpanelService.getLastSeen({ role }).then(result => {
      setLastSeenUsers(result);
    });
  }, [role]);

  return (
    <div className="card1 card-top  last-seen-users mb-8">
      <div className="top flex center-align">
        <h3>Derniers vus</h3>
        <Select
          label="Rôle"
          value={role}
          options={[
            { id: ROLES.USER, label: <T id="roles.user" /> },
            { id: ROLES.PRO, label: <T id="roles.pro" /> },
          ]}
          onChange={setRole}
        />
      </div>
      {lastSeenUsers ? (
        <>
          {lastSeenUsers.slice(0, 5).map(mapUser)}
          <DialogSimple
            buttonProps={{
              raised: false,
              label: 'Voir plus',
              primary: true,
              size: 'small',
            }}
            title="Derniers vus"
            closeOnly
          >
            {lastSeenUsers.map(mapUser)}
          </DialogSimple>
        </>
      ) : (
        <Loading small />
      )}
    </div>
  );
};

export default LastSeenUsers;
