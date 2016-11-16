module.exports = {
  servers: {
    one: {
      host: '46.101.148.135',
      username: 'root',
      pem: '/Users/Florian/.ssh/id_rsa',
      // password:
      // or leave blank for authenticate from ssh-agent
    },
  },

  setupMongo: false,
  setupNode: true,
  nodeVersion: '4.4.7',
  setupPhantom: true,

  meteor: {
    name: 'e-potek',
    path: '.',
    servers: {
      one: { },
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://e-potek.ch',
      MONGO_URL: 'mongodb://admin1:password@gcp-europe-west1-cpu.0.dblayer.com:15119/e-potek-test?ssl=true',
    },

    dockerImage: 'abernix/meteord:base',
  },
};
