import { Method } from '../methods/methods';

export const activityInsert = new Method({
  name: 'activityInsert',
  params: { object: Object },
});

export const activityUpdate = new Method({
  name: 'activityUpdate',
  params: { activityId: String, object: Object },
});

export const activityRemove = new Method({
  name: 'activityRemove',
  params: { activityId: String },
});
