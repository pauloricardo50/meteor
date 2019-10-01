// @flow
import React from 'react';

type UserActivityDescriptionProps = {
  activity: Object,
};

const UserActivityDescription = ({
  activity: { description },
}: UserActivityDescriptionProps) => (
  <div className="user-activity-description">{description}</div>
);

export default UserActivityDescription;
