module.exports = {
  servers: {
    one: {
      host: '165.227.128.30',
      username: 'root',
      pem: '~/.ssh/id_rsa',
      // password: // leave blank for authenticate from ssh-agent
    },
  },
  meteor: {
    name: 'e-potek',
    path: '../../',
    servers: {
      one: {},
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      // ROOT_URL: 'https://www.e-potek.ch',
      // MONGO_URL: 'mongodb://admin1:password@gcp-europe-west1-cpu.0.dblayer.com:15119/e-potek-test?ssl=true',
      MONGO_URL: 'mongodb://admin1:password@aws-eu-central-1-portal.2.dblayer.com:15723,aws-eu-central-1-portal.0.dblayer.com:15723/admin?ssl=true',
    },
    docker: {
      image: 'abernix/meteord:base',
      // image: 'guillim/meteord:node6.9.1V3',
    },
    enableUploadProgressBar: true,
  },
};
