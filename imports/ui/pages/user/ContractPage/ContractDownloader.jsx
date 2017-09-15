import React from 'react';
import PropTypes from 'prop-types';

import FileDownloader from '/imports/ui/components/general/FileDownloader';
import { T } from '/imports/ui/components/general/Translation';

const ContractDownloader = ({ contract }) => {
  const contractKey = contract && contract.length && contract[0].key;

  return (
    <div className="flex center" style={{ marginBottom: 32 }}>
      <div
        className="mask1 flex-col center"
        style={{ maxWidth: 400, width: '100%' }}
      >
        <T
          id={
            contractKey ? (
              'ContractDownloader.ready'
            ) : (
              'ContractDownloader.waiting'
            )
          }
        />
        <FileDownloader
          buttonLabel={<T id="general.download" />}
          fileName="Contrat e-Potek"
          fileKey={contractKey || ''}
          disabled={!contractKey}
          primary
          style={{ marginTop: 16 }}
        />
      </div>
    </div>
  );
};

ContractDownloader.propTypes = {
  contract: PropTypes.arrayOf(PropTypes.object),
};

ContractDownloader.defaultProps = {
  contract: undefined,
};

export default ContractDownloader;
