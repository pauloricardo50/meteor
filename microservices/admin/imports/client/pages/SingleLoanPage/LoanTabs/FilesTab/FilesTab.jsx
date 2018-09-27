import React from 'react';
import PropTypes from 'prop-types';

import FileTabs from 'core/components/FileTabs';

const FilesTab = props => <FileTabs {...props} />;

FilesTab.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default FilesTab;
