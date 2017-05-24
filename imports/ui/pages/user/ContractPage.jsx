import React from 'react';
import PropTypes from 'prop-types';

import FileTabs from './contractPage/FileTabs.jsx';
import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';
import ConfirmButton from '/imports/ui/components/general/ConfirmButton.jsx';
import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';

import { filesPercent } from '/imports/js/arrays/steps';
import { borrowerFiles, requestFiles } from '/imports/js/arrays/files';
import cleanMethod from '/imports/api/cleanMethods';

const handleClick = id => {
  cleanMethod('updateRequest', { 'logic.lender.contractRequested': true }, id);
};

const getAction = (request, percent) => {
  if (!request.logic.lender.contractRequested) {
    return (
      <div className="text-center" style={{ marginBottom: 40 }}>
        <h4>Progrès: {Math.round(percent * 1000) / 10}%</h4>
        <ConfirmButton
          disabled={percent < 1}
          label="Demander le contrat"
          secondary
          handleClick={() => handleClick(request._id)}
        />
      </div>
    );
  }
  return (
    <div className="text-center">
      <h4>Vous serez notifié par e-mail lorsque votre contrat est prêt.</h4>
      <div style={{ height: 150 }}>
        <LoadingComponent />
      </div>
    </div>
  );
};

const ContractPage = props => {
  const percent =
    (filesPercent(props.loanRequest, requestFiles, 'contract') +
      filesPercent(props.borrowers, borrowerFiles, 'contract')) /
    (1 + props.borrowers.length);

  return (
    <ProcessPage {...props} stepNb={3} id="contract" showBottom={false}>
      <div className="mask1">
        <h1>Obtenez le contrat de prêt</h1>
        <div className="description">
          <p>
            Pour obtenir un contrat officiel de prêt, votre prêteur a encore besoin de quelques documents. Dès que vous avez soumis tous les documents nécessaires, vous pourrez demander le contrat, ce qui prendra quelques jours à votre prêteur.
          </p>
        </div>

        {getAction(props.loanRequest, percent)}

        <div style={{ margin: '0 -16px' }}>
          <FileTabs {...props} />
        </div>
      </div>
    </ProcessPage>
  );
};

ContractPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ContractPage;
