import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation.jsx';
import FileDownloader from '/imports/ui/components/general/FileDownloader.jsx';

import DashboardItem from './DashboardItem.jsx';

const DashboardDownload = props => {
  const { files } = props.loanRequest;
  const contractKey = files.contract && files.contract.length && files.contract[0].key;

  return (
    <DashboardItem title={<T id="DashboardDownload.title" />}>
      <h4><T id="DashboardDownload.contract" /></h4>
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
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DashboardDownload;
