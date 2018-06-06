import React from 'react';
import PropTypes from 'prop-types';

import FileTabs from 'core/components/FileTabs';
import NewDocumentForm from './NewDocumentForm';

const FilesTab = props => (
  <div>
    <NewDocumentForm loanId={props.loan._id} />
    <FileTabs {...props} />
  </div>
);

FilesTab.propTypes = {};

export default FilesTab;
