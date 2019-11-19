// @flow
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import MixpanelService from 'core/utils/mixpanel';
import Loading from 'core/components/Loading';

type LastSeenProps = {};

const LastSeen = ({ userId }: LastSeenProps) => {
  const [lastSeen, setLastSeen] = useState(null);

  useEffect(() => {
    setLastSeen(null);
    MixpanelService.getLastSeen({ userId }).then(result => {
      setLastSeen(result);
    });
  }, [userId]);

  if (!lastSeen) {
    return <Loading small />;
  }

  if (!lastSeen.length) {
    return <h4>Jamais vu</h4>;
  }

  const [last] = lastSeen;

  return (
    <h4>
      <span className="secondary">Vu pour la dernière fois:</span>
      &nbsp;
      {moment(last.$properties.$last_seen).fromNow()}
    </h4>
  );
};

export default LastSeen;
