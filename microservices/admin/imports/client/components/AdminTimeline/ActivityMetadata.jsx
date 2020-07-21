import React from 'react';
import { useStaticMeteorData } from 'imports/core/hooks/useMeteorData';

import { ACTIVITIES_COLLECTION } from 'core/api/activities/activityConstants';
import DialogSimple from 'core/components/DialogSimple/DialogSimple';

import JSONMarkdown from '../JSONMarkdown';

const ActivityMetadata = ({ activityId }) => {
  const { data: activity, loading } = useStaticMeteorData({
    query: ACTIVITIES_COLLECTION,
    params: { $filters: { _id: activityId }, metadata: 1 },
    type: 'single',
  });

  if (loading) {
    return null;
  }

  return (
    <DialogSimple
      closeOnly
      text={<JSONMarkdown object={activity?.metadata} />}
      title="Metadata"
      buttonProps={{ primary: true, label: 'Metadata', raised: false }}
      fullWidth
    />
  );
};

export default ActivityMetadata;
