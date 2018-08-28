var yaml = require('write-yaml');

var argv = require('yargs')
  .usage('Usage : $0 [options]')
  .example(
    '$0  -n e-potek-www -m 512M -i 1 -s meteor-mongo -f file.yml',
    'Generates the manifest in file.yml file',
  )
  .alias('n', 'name')
  .nargs('n', 1)
  .describe('n', 'Name of the application')
  .alias('m', 'memory')
  .nargs('m', 1)
  .describe('m', 'Memory to allocate')
  .alias('i', 'instances')
  .nargs('i', 1)
  .describe('i', 'Instances to allocate')
  .alias('s', 'service')
  .nargs('s', 1)
  .describe('s', 'Name of the service to link')
  .alias('f', 'file')
  .nargs('f', 1)
  .describe('f', 'File to write')
  .demandOption(['n', 'm', 'i', 's', 'f'])
  .help('h')
  .alias('h', 'help').argv;

var data = {
  applications: [
    {
      name: argv.n,
      memory: argv.m,
      instances: argv.i,
      buildpack: 'https://github.com/cloudfoundry/nodejs-buildpack',
      services: [argv.s],
    },
  ],
};

yaml(argv.f, data, console.log);
