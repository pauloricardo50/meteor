import React from 'react';
import PropTypes from 'prop-types';

import FileTabs from 'core/components/FileTabs';
import PageApp from '../../components/PageApp';

const FilesPage = props => (
  <PageApp id="FilesPage">
    <FileTabs
      {...props}
      // disabled={!props.loan.userFormsEnabled}
      disabled={false}
    />
  </PageApp>
);

FilesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesPage;
