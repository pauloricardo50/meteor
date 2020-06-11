import React, { useEffect, useState } from 'react';
import moment from 'moment';

import MixpanelService from 'core/utils/mixpanel';

const LastSeen = ({ userId }) => {
  const [lastSeen, setLastSeen] = useState(null);

  useEffect(() => {
    setLastSeen(null);
    MixpanelService.getLastSeen({ userId }).then(result => {
      setLastSeen(result);
    });
  }, [userId]);

  if (!lastSeen) {
    return <h4 className="m-0">Loading...</h4>;
  }

  if (!lastSeen.length) {
    return <h4 className="m-0 animated fadeIn">Jamais vu</h4>;
  }

  const [last] = lastSeen;

  return (
    <h4 className="m-0 animated fadeIn">
      {moment(last.$properties.$last_seen).fromNow()}
    </h4>
  );
};

export default LastSeen;
