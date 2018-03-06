import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import FileDownloader from '/imports/ui/components/FileDownloader';

import DashboardItem from './DashboardItem';

const DashboardDownload = (props) => {
  const { files } = props.loan;
  const contractKey =
    files.contract && files.contract.length && files.contract[0].key;

  return (
    <DashboardItem title={<T id="DashboardDownload.title" />}>
      <h4>
        <T id="DashboardDownload.contract" />
      </h4>
      <div className="text-center">
        <FileDownloader
          buttonLabel={<T id="general.download" />}
          fileName="Contrat e-Potek"
          fileKey={contractKey}
        />
      </div>
    </DashboardItem>
  );
};

DashboardDownload.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DashboardDownload;
