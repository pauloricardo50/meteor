var fs = require('fs');

var argv = require('yargs')
  .usage('Usage : $0 [options]')
  .example(
    '$0  -n e-potek-www -l launch.js -i www.tar.gz -f file.json',
    'Generates the package.json in file.json file',
  )
  .alias('n', 'name')
  .nargs('n', 1)
  .describe('n', 'Name of the application')
  .alias('l', 'launcher')
  .nargs('l', 1)
  .describe('l', 'Script to launch on start')
  .alias('i', 'image')
  .nargs('i', 1)
  .describe('i', 'Image to deploy')
  .alias('f', 'file')
  .nargs('f', 1)
  .describe('f', 'JSON file to write to')
  .demandOption(['n', 'l', 'i', 'f'])
  .help('h')
  .alias('h', 'help').argv;

var data = {
  name: argv.n,
  private: true,
  scripts: {
    start: `node ${argv.l}`,
    postinstall: `tar -xf ${
      argv.i
    } && (cd bundle/programs/server && npm install)`,
  },
  engines: {
    node: '8.11.3',
  },
  dependencies: {
    cfenv: '1.0.4',
  },
};

fs.writeFile(argv.f, JSON.stringify(data), () => {});
