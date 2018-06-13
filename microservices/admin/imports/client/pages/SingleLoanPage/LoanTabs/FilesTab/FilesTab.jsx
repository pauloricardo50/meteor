import React from 'react';
import PropTypes from 'prop-types';

import FileTabs from 'core/components/FileTabs';
import NewDocumentForm from './NewDocumentForm';

const FilesTab = props => (
  <React.Fragment>
    <NewDocumentForm loanId={props.loan._id} />
    <FileTabs {...props} />
  </React.Fragment>
);

FilesTab.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default FilesTab;
