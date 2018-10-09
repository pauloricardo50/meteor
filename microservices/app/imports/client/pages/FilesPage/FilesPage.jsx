import React from 'react';
import PropTypes from 'prop-types';

import FileTabs from 'core/components/FileTabs';
import Page from 'core/components/Page';

const getStructurePropertyWithDocuments = ({
  loan: { properties, structure },
}) =>
  !!(structure && structure.propertyId)
  && properties.find(({ _id }) => structure.propertyId === _id);

const FilesPage = props => (
  <Page id="FilesPage">
    <FileTabs
      {...props}
      property={getStructurePropertyWithDocuments(props)}
      borrowers={props.loan.borrowers}
    />
  </Page>
);

FilesPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default FilesPage;
