import React from 'react';
import PropTypes from 'prop-types';

import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';
import ConfirmButton from '/imports/ui/components/general/ConfirmButton.jsx';
import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';

import { filesPercent } from '/imports/js/arrays/steps';
import { borrowerFiles, requestFiles } from '/imports/js/arrays/files';
import cleanMethod from '/imports/api/cleanMethods';

const handleClick = id => {
  cleanMethod('updateRequest', { 'logic.lender.closingRequested': true }, id);
};

const getAction = (request, percent) => {
  if (!request.logic.lender.closingRequested) {
    return (
      <div className="text-center" style={{ marginBottom: 40 }}>
        <h4>Progrès: {Math.round(percent * 1000) / 10}%</h4>
        <ConfirmButton
          disabled={percent < 1}
          label="Demander le décaissement"
          secondary
          handleClick={() => handleClick(request._id)}
        />
      </div>
    );
  }
  return (
    <div className="text-center">
      <h4>Vous serez notifié par e-mail lorsque votre prêteur est disposé au décaissement.</h4>
      <div style={{ height: 150 }}>
        <LoadingComponent />
      </div>
    </div>
  );
};

const ClosingPage = props => {
  // const percent =
  //   (filesPercent(props.loanRequest, requestFiles, 'closing') +
  //     filesPercent(props.borrowers, borrowerFiles, 'closing')) /
  //   (1 + props.borrowers.length);

  return (
    <ProcessPage {...props} stepNb={3} id="contract" showBottom={false}>
      <div className="mask1">
        <h1>Décaissez votre prêt</h1>
        <div className="description">
          <p>
            Lorsque vous avez soumis les derniers documents, vous pourrez demander à votre prêteur de décaisser le prêt.
          </p>
        </div>

        {/* {getAction(props.loanRequest, percent)} */}

      </div>
    </ProcessPage>
  );
};

ClosingPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ClosingPage;
