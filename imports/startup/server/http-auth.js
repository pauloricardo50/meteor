import { HttpBasicAuth } from 'meteor/jabbslad:basic-auth';

const setupAuth = () => {
  const basicAuth = new HttpBasicAuth('epotek', 'goforlife');
  basicAuth.protect();
};

export default setupAuth;
