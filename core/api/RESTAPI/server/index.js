import RESTAPI from './RESTAPI';
import { inviteUserToPromotion } from './endpoints';

const startAPI = () => {
  const api = new RESTAPI('/api');
  api.connectHandlers({
    path: '/api/inviteUserToPromotion',
    method: 'POST',
    handler: inviteUserToPromotion(api),
  });
  return api;
};

export default startAPI;
