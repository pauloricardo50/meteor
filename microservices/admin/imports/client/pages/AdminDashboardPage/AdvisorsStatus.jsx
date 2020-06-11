import React from 'react';

import { useAdmins } from '../../components/AdminsContext/AdminsContext';
import Advisor from '../../components/Advisor/Advisor';

const AdvisorsStatus = () => {
  const admins = useAdmins();

  const inRoundRobin = admins.filter(({ isInRoundRobin }) => isInRoundRobin);

  const available = inRoundRobin.filter(
    ({ roundRobinTimeout }) => !roundRobinTimeout,
  );
  const unavailable = inRoundRobin.filter(
    ({ roundRobinTimeout }) => roundRobinTimeout,
  );

  return (
    <div className="animated fadeIn">
      <h4 className="mt-0">Conseillers en round-robin</h4>

      <div className="flex mb-8" style={{ justifyContent: 'flex-end' }}>
        {available.map(({ _id }) => (
          <Advisor key={_id} advisorId={_id} className="ml-4" />
        ))}
      </div>

      <div className="flex" style={{ justifyContent: 'flex-end' }}>
        {unavailable.map(({ _id }) => (
          <Advisor key={_id} advisorId={_id} className="ml-4" />
        ))}
      </div>
    </div>
  );
};

export default AdvisorsStatus;
