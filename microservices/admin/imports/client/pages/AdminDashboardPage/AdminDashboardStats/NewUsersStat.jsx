import React, { useState } from 'react';
import groupBy from 'lodash/groupBy';
import moment from 'moment';

import {
  ACTIVITIES_COLLECTION,
  ACTIVITY_EVENT_METADATA,
  ACTIVITY_TYPES,
} from 'core/api/activities/activityConstants';
import {
  ROLES,
  USERS_COLLECTION,
  USER_STATUS,
} from 'core/api/users/userConstants';
import Select from 'core/components/Select';
import useMeteorData from 'core/hooks/useMeteorData';

import Advisor from '../../../components/Advisor';
import StatItem from './StatItem';

const dateFrom = days => moment().subtract(days, 'days').toDate();

const NewUsersStat = () => {
  const [days, setDays] = useState(30);
  const { data: prospectUsers, loading: userLoading } = useMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: {
        roles: { $elemMatch: { _id: ROLES.USER, assigned: true } },
        status: USER_STATUS.PROSPECT,
      },
      assignedEmployeeId: 1,
    },
  });
  const { data: convertedUsers, loading: activityLoading } = useMeteorData(
    {
      query: ACTIVITIES_COLLECTION,
      params: {
        $filters: {
          createdAt: { $gte: dateFrom(days) },
          'metadata.event': ACTIVITY_EVENT_METADATA.USER_CHANGED_STATUS,
          'metadata.details.prevStatus': USER_STATUS.PROSPECT,
          'metadata.details.nextStatus': USER_STATUS.QUALIFIED,
        },
        user: { assignedEmployeeId: 1 },
      },
    },
    [days],
  );
  const { data: dripEmailsSent } = useMeteorData(
    {
      query: ACTIVITIES_COLLECTION,
      params: { $filters: { type: ACTIVITY_TYPES.DRIP } },
      type: 'count',
    },
    [days],
  );

  const groupedUsers =
    !userLoading && groupBy(prospectUsers, 'assignedEmployeeId');
  const groupedActivities =
    !activityLoading && groupBy(convertedUsers, 'user.assignedEmployeeId');

  return (
    <StatItem large>
      <table style={{ alignSelf: 'stretch' }}>
        <thead>
          <tr>
            <td />
            <td style={{ textAlign: 'right' }}>En cours de drip</td>
            <td style={{ textAlign: 'right' }}>Clients qualifiés</td>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedUsers).map(advisorId => {
            const count = groupedUsers[advisorId].length;
            const qualifiedCount = groupedActivities[advisorId]?.length || 0;

            return (
              <tr className="pb-4 pt-4" key={advisorId}>
                <td>
                  <Advisor advisorId={advisorId} />
                </td>
                <td style={{ textAlign: 'right' }}>{count}</td>
                <td style={{ textAlign: 'right' }}>{qualifiedCount}</td>
              </tr>
            );
          })}

          <tr className="pb-4 pt-4">
            <td>Total</td>
            <td style={{ textAlign: 'right' }}>{prospectUsers?.length || 0}</td>
            <td style={{ textAlign: 'right' }}>
              {convertedUsers?.length || 0}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex-col center-align">
        <h4 className="title flex-col text-center">
          <span>💧 Drip 💧</span>
          <small className="secondary">
            {dripEmailsSent} emails envoyés à votre place
          </small>
        </h4>
        <Select
          label="Qualifiés dans les"
          options={[
            { id: 7, label: '7 derniers jours' },
            { id: 30, label: '30 derniers jours' },
            { id: 90, label: '90 derniers jours' },
          ]}
          onChange={setDays}
          value={days}
        />
      </div>
    </StatItem>
  );
};

export default NewUsersStat;
