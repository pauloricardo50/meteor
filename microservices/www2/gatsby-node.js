const path = require('path');

const onCreateWebpackConfig = ({ actions: { setWebpackConfig } }) => {
  // This should stay in this file for the alias to work
  setWebpackConfig({
    resolve: {
      symlinks: false,
      alias: {
        core: path.resolve(__dirname, 'src/core/'),
      },
    },
  });
};

export { onCreateWebpackConfig };
