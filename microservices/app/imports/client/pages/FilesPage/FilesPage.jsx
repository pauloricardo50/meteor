import React from 'react';
import PropTypes from 'prop-types';

import FileTabs from 'core/components/FileTabs';
import Page from 'core/components/Page';

const FilesPage = props => (
  <Page id="FilesPage">
    <FileTabs
      {...props}
      properties={props.loan.properties}
      borrowers={props.loan.borrowers}
      // disabled={!props.loan.userFormsEnabled}
      disabled={false}
    />
  </Page>
);

FilesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesPage;
