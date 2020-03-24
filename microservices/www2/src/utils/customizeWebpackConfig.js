const path = require('path');

const customizeWebpackConfig = ({ actions: { setWebpackConfig } }) => {
  setWebpackConfig({
    resolve: {
      symlinks: false,
      alias: {
        core: path.resolve(__dirname, 'src/core/'),
      },
    },
  });
};

export default customizeWebpackConfig;
