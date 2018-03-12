import React from 'react';
import PropTypes from 'prop-types';

import Page from '/imports/ui/components/Page';
import { T } from 'core/components/Translation';
import FilesTabs from 'core/components/FilesTabs';

const FilesPage = props => (
  <Page id="FilesPage">
    <div className="mask1">
      <p style={{ marginBottom: 32 }}>
        <T id="FilesPage.description" />
      </p>

      <FilesTabs {...props} />
    </div>
  </Page>
);

FilesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesPage;
