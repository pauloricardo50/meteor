import { SESSIONS_QUERIES } from './sessionConstants';
import Sessions from '.';
import { userSession } from '../fragments';

export const userImpersonatedSession = Sessions.createQuery(
  SESSIONS_QUERIES.USER_IMPERSONATED_SESSION,
  {
    ...userSession(),
    $options: { sort: { updatedAt: -1 } },
  },
);
