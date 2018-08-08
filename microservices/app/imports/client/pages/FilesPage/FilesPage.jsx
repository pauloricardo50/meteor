import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import FileTabs from 'core/components/FileTabs';
import Page from '../../components/Page';

const FilesPage = props => (
  <Page id="FilesPage">
    <div className="card1 card-top">
      <p style={{ marginBottom: 32 }}>
        <T id="FilesPage.description" />
      </p>

      <FileTabs
        {...props}
        property={props.loan.structure && props.loan.structure.property}
        borrowers={props.loan.borrowers}
      />
    </div>
  </Page>
);

FilesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesPage;
