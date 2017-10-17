module.exports = {
  servers: {
    one: {
      host: '46.101.148.135',
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
      ROOT_URL: 'https://www.e-potek.ch',
      MONGO_URL:
        'mongodb://admin1:password@gcp-europe-west1-cpu.0.dblayer.com:15119/e-potek-test?ssl=true',
    },
    docker: {
      image: 'abernix/meteord:node-8.4.0-base',
    },
    ssl: {
      crt: '../../bundle.crt',
      key: '../../privatekey.key',
      port: 443,
      // upload: false, // Use this for better security, you have to place the bundle.crt and privatekey.key files on the server yourself
    },
    enableUploadProgressBar: true,
  },
};
