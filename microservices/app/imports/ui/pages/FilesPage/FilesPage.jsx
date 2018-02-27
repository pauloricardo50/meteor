import React from 'react';
import PropTypes from 'prop-types';

import Tab from 'react-bootstrap/lib/Tab';
import Tabs from 'react-bootstrap/lib/Tabs';

import Page from '/imports/ui/components/Page';
import UploaderArray from 'core/components/UploaderArray';
import { T } from 'core/components/Translation';
import FilesTabs from 'core/components/FilesTabs';

const styles = {
  tabContent: {
    padding: '40px 0',
  },
};

const FilesPage = ({ loan, borrowers, property }) => (
  <Page id="FilesPage">
    <div className="mask1">
      <p style={{ marginBottom: 32 }}>
        <T id="FilesPage.description" />
      </p>

      <FilesTabs {...this.props} />
    </div>
  </Page>
);

FilesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesPage;
