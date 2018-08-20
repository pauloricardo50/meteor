import React from 'react';
import PropTypes from 'prop-types';

import FileTabs from 'core/components/FileTabs';

const FilesTab = props => (
  <React.Fragment>
    <FileTabs {...props} />
  </React.Fragment>
);

FilesTab.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default FilesTab;
