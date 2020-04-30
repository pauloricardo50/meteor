export const MICROSERVICES = {
  ADMIN: 'admin',
  APP: 'app',
  PRO: 'pro',
  WWW: 'www',
  BACKEND: 'backend',
};

export const MICROSERVICE_PORTS = {
  [MICROSERVICES.WWW]: 3000,
  [MICROSERVICES.APP]: 4000,
  [MICROSERVICES.PRO]: 4100,
  [MICROSERVICES.ADMIN]: 5000,
  [MICROSERVICES.BACKEND]: 5500,
};

export const PORT_OFFSETS = {
  test: 5,
  'bundle-size': 10,
  'test-e2e': 15,
};

export const SCRIPTS = {
  start: 'start.js',
  test: 'test.js',
  'test-e2e': 'test-e2e.js',
  'bundle-size': 'bundle-size.js',
  custom: 'custom/custom.js',
  'update-meteor-packages': 'update-meteor-packages.js',
};
