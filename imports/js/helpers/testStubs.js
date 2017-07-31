// TODO: This does not yet work with wallabyJS

import proxyquire from 'proxyquire';

const proxyquireStrict = proxyquire.noCallThru();

const packages = {
  meteor: {
    Meteor: {
      methods: () => {},
      defer: () => {},
    },
  },
};

const proxyStubs = {
  'meteor/meteor': packages.meteor,
};

const stubPackages = (fileToImport) => {
  const a = '';

  console.log(fileToImport);
  console.log(typeof proxyquireStrict);
  return proxyquireStrict(fileToImport, proxyStubs);
};

export default stubPackages;
