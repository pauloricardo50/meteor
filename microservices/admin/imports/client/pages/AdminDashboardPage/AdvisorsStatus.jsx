import React from 'react';
import Badge from '@material-ui/core/Badge';

import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import { employeesById } from 'core/arrays/epotekEmployees';
import Link from 'core/components/Link';
import Tooltip from 'core/components/Material/Tooltip';
import useMeteorData from 'core/hooks/useMeteorData';

const AdvisorsStatus = () => {
  const { data: advisors, loading } = useMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: {
        'roles._id': ROLES.ADVISOR,
      },
      isInRoundRobin: 1,
      name: 1,
      roundRobinTimeout: 1,
    },
  });

  if (loading) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }

  const inRoundRobin = advisors.filter(({ isInRoundRobin }) => isInRoundRobin);

  const available = inRoundRobin.filter(
    ({ roundRobinTimeout }) => !roundRobinTimeout,
  );
  const unavailable = inRoundRobin.filter(
    ({ roundRobinTimeout }) => roundRobinTimeout,
  );

  return (
    <div className="animated fadeIn">
      <h4 className="mt-0">Conseillers en round-robin</h4>

      <div className="flex" style={{ justifyContent: 'flex-end' }}>
        {available.map(({ _id, name }) => (
          <Link key={_id} className="ml-8" to={`/users/${_id}`}>
            <Tooltip title="Dispo">
              <Badge
                color="secondary"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={' '}
                variant="dot"
                overlap="circle"
              >
                <img
                  src={employeesById[_id]?.src}
                  alt={name}
                  style={{ borderRadius: '50%', width: 30, height: 30 }}
                />
              </Badge>
            </Tooltip>
          </Link>
        ))}
      </div>

      {unavailable.map(({ _id, name, roundRobinTimeout }) => (
        <Link
          className="flex center-align mt-8"
          style={{ justifyContent: 'flex-end' }}
          key={_id}
          to={`/users/${_id}`}
        >
          <span className="mr-8">{roundRobinTimeout}</span>
          <Tooltip title="Pas dispo, tout nouveau client est redirigé sur les conseillers dispo">
            <Badge
              color="error"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={' '}
              variant="dot"
              overlap="circle"
            >
              <img
                src={employeesById[_id]?.src}
                alt={name}
                style={{ borderRadius: '50%', width: 30, height: 30 }}
              />
            </Badge>
          </Tooltip>
        </Link>
      ))}
    </div>
  );
};

export default AdvisorsStatus;
