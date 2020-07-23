import React from 'react';
import { useReactiveMeteorData } from 'imports/core/hooks/useMeteorData';

import { ACTIVITIES_COLLECTION } from 'core/api/activities/activityConstants';
import DialogSimple from 'core/components/DialogSimple/DialogSimple';
import Loading from 'core/components/Loading/Loading';

import JSONMarkdown from '../JSONMarkdown';

const DialogContent = ({ activityId }) => {
  const { data: activity, loading } = useReactiveMeteorData({
    query: ACTIVITIES_COLLECTION,
    params: { $filters: { _id: activityId }, metadata: 1 },
    type: 'single',
    refetchOnMethodCall: false,
  });

  if (loading) {
    return <Loading />;
  }

  return <JSONMarkdown object={activity?.metadata} />;
};

const ActivityMetadata = ({ activityId }) => (
  <DialogSimple
    closeOnly
    title="Metadata"
    buttonProps={{ primary: true, label: 'Metadata', raised: false }}
    fullWidth
    renderProps
  >
    {() => <DialogContent activityId={activityId} />}
  </DialogSimple>
);

export default ActivityMetadata;
