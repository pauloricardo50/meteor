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

// const stubPackages = fileToImport => proxyquireStrict(fileToImport, proxyStubs);
const stubPackages = fileToImport => require('../StartFormArray');

export default stubPackages;
