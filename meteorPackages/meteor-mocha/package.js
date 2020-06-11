Package.describe({
  name: 'meteortesting:mocha',
  summary: 'Run Meteor package or app tests with Mocha',
  git: 'https://github.com/meteortesting/meteor-mocha.git',
  documentation: '../README.md',
  version: '2.0.0',
  testOnly: true,
});

Package.onUse(function onUse(api) {
  api.use([
    'meteortesting:mocha-core@7.0.0',
    'ecmascript@0.3.0',
  ]);

  api.use(['meteortesting:browser-tests@1.3.2', 'http@1.0.0'], 'server');
  api.use('browser-policy@1.0.0', 'server', { weak: true });
  api.use('lmieulet:meteor-coverage@1.1.4 || 2.0.1 || 3.0.0', 'client', { weak: true });

  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});
