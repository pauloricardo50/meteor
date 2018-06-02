import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import ProcessPage from '../../components/ProcessPage';
import FileTabs from './FileTabs';
import ContractDownloader from './ContractDownloader';

const ContractPage = props => (
  <ProcessPage {...props} stepNb={3} id="contract" showBottom={false}>
    <section className="mask1 contract-page">
      <div className="description">
        <p>
          <T id="ContractPage.description" />
        </p>
      </div>

      <ContractDownloader contract={props.loan.documents.contract} />

      <FileTabs {...props} />
    </section>
  </ProcessPage>
);

ContractPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ContractPage;
