import { Meteor } from 'meteor/meteor';

import { getFromFiber, storeOnFiber } from './fiberStorage';

const MICROSERVICE = '__MICROSERVICE_NAME';
const CLIENT_URL = '__CLIENT_URL';
const HOST = '__CLIENT_HOST';

const getMicroserviceFromHost = (host) => {
  const { subdomains } = Meteor.settings.public;
  // In case the subdomain is missing, assume it is e-potek.ch, i.e. www
  let result = 'www';

  Object.keys(subdomains).some((microservice) => {
    const microserviceUrl = subdomains[microservice];

    if (microserviceUrl.includes(host)) {
      result = microservice;
      return true;
    }
  });

  return result;
};

export const setClientUrl = ({ host, href }) => {
  const microservice = getMicroserviceFromHost(host);
  storeOnFiber(HOST, host);
  storeOnFiber(MICROSERVICE, microservice);
  storeOnFiber(CLIENT_URL, href);
};

export const getClientHost = () => getFromFiber(HOST);
export const getClientMicroservice = () => getFromFiber(MICROSERVICE);
export const getClientUrl = () => getFromFiber(CLIENT_URL);
