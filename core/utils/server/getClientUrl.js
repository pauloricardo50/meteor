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

export const getClientHost = () => getFromFiber(HOST);
export const getClientMicroservice = () => getFromFiber(MICROSERVICE);
export const getClientUrl = () => getFromFiber(CLIENT_URL);

export const setClientUrl = ({ host, href }) => {
  const currentHost = getClientHost();
  const currentUrl = getClientUrl();
  const currentMicroservice = getClientMicroservice();

  if (!currentHost) {
    storeOnFiber(HOST, host);
  }

  if (!currentUrl) {
    storeOnFiber(CLIENT_URL, href);
  }

  if (!currentMicroservice) {
    const microservice = getMicroserviceFromHost(host);
    storeOnFiber(MICROSERVICE, microservice);
  }
};

export const setClientMicroservice = (microservice) => {
  const currentMicroservice = getClientMicroservice();
  if (!currentMicroservice) {
    storeOnFiber(MICROSERVICE, microservice);
  }
};
