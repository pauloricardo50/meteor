import { Meteor } from 'meteor/meteor';

import { getFromFiber, storeOnFiber } from './fiberStorage';

const MICROSERVICE = '__MICROSERVICE_NAME';
const CLIENT_URL = '__CLIENT_URL';
const HOST = '__CLIENT_HOST';

const getMicroserviceFromHost = host => {
  const { subdomains } = Meteor.settings.public;
  // In case the subdomain is missing, assume it is e-potek.ch, i.e. www
  let result = 'www';

  Object.keys(subdomains).some(microservice => {
    const microserviceUrl = subdomains[microservice];

    // When testing, the port number is incremented by 5 or 15
    // make sure these checks work coherently in test and regular modes
    if (Meteor.isTest) {
      const parts = microserviceUrl.split(':');
      const port = Number(parts.slice(-1)[0]);
      const urlStart = parts.slice(0, -1).join('');
      if (port >= 1000) {
        if (
          `${urlStart}:${port + 5}`.includes(host) ||
          `${urlStart}:${port + 15}`.includes(host)
        ) {
          result = microservice;
          return true;
        }
      }
    }

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

export const setClientMicroservice = microservice => {
  const currentMicroservice = getClientMicroservice();
  if (!currentMicroservice) {
    storeOnFiber(MICROSERVICE, microservice);
  }
};
