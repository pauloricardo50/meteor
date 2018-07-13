import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import FileTabs from 'core/components/FileTabs';
import Page from '../../components/Page';

const FilesPage = props => (
  <Page id="FilesPage">
    <div className="mask1">
      <p style={{ marginBottom: 32 }}>
        <T id="FilesPage.description" />
      </p>

      <FileTabs {...props} />
    </div>
  </Page>
);

FilesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesPage;
