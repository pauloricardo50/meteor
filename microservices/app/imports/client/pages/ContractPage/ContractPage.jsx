import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import Page from '../../components/Page';
import FileTabs from './FileTabs';
import ContractDownloader from './ContractDownloader';

const ContractPage = props => (
  <Page id="contract">
    <section className="mask1 contract-page">
      <div className="description">
        <p>
          <T id="ContractPage.description" />
        </p>
      </div>

      <ContractDownloader contract={props.loan.documents.contract} />

      <FileTabs {...props} />
    </section>
  </Page>
);

ContractPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ContractPage;
