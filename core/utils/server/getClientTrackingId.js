import { getFromFiber, storeOnFiber } from './fiberStorage';

const TRACKING_ID = '__CLIENT_TRACKING_ID';

export const setClientTrackingId = trackingId =>
  storeOnFiber(TRACKING_ID, trackingId);
export const getClientTrackingId = () => getFromFiber(TRACKING_ID);
