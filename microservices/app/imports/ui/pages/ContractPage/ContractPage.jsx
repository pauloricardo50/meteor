import React from 'react';
import PropTypes from 'prop-types';

import ProcessPage from '/imports/ui/components/ProcessPage';
import { T } from 'core/components/Translation';

import { filesPercent } from 'core/arrays/steps';
import { borrowerFiles, requestFiles } from 'core/api/files/files';

import FileTabs from './FileTabs';
import ContractDownloader from './ContractDownloader';

const ContractPage = props => (
  // const percent =
  //   (filesPercent(props.loanRequest, requestFiles, 'contract') +
  //     filesPercent(props.borrowers, borrowerFiles, 'contract')) /
  //   (1 + props.borrowers.length);

  <ProcessPage {...props} stepNb={3} id="contract" showBottom={false}>
    <div className="mask1">
      <div className="description">
        <p>
          <T id="ContractPage.description" />
        </p>
      </div>

      <ContractDownloader contract={props.loanRequest.files.contract} />

      <FileTabs {...props} />
    </div>
  </ProcessPage>
);

ContractPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ContractPage;
