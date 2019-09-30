import { Method } from '../methods/methods';

export const shareImpersonatedSession = new Method({
  name: 'shareImpersonatedSession',
  params: { share: Boolean },
});

export const followImpersonatedSession = new Method({
  name: 'followImpersonatedSession',
  params: { connectionId: String },
});

export const setUserConnected = new Method({
  name: 'setUserConnected',
  params: { connectionId: String },
});
