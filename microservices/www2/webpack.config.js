const path = require('path');

module.exports = {
  resolve: {
    symlinks: false,
    alias: {
      core: path.resolve(__dirname, 'src/core/'),
    },
  },
};
