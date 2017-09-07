import React from 'react';
import PropTypes from 'prop-types';

import ProcessPage from '/imports/ui/components/general/ProcessPage';
import ConfirmButton from '/imports/ui/components/general/ConfirmButton';
import { LoadingComponent } from '/imports/ui/components/general/Loading';
import { T } from '/imports/ui/components/general/Translation';

import { filesPercent } from '/imports/js/arrays/steps';
import { borrowerFiles, requestFiles } from '/imports/js/arrays/files';
import cleanMethod from '/imports/api/cleanMethods';

const handleClick = (id) => {
  cleanMethod('updateRequest', { 'logic.lender.closingRequested': true }, id);
};

const getAction = (request, percent) => {
  if (!request.logic.lender.closingRequested) {
    return (
      <div className="text-center" style={{ marginBottom: 40 }}>
        <h4>
          <T id="ClosingPage.progress" values={{ value: percent }} />
        </h4>
        <ConfirmButton
          disabled={percent < 1}
          label={<T id="ClosingPage.CTA" />}
          secondary
          handleClick={() => handleClick(request._id)}
        />
      </div>
    );
  }
  return (
    <div className="text-center">
      <h4>
        <T id="ClosingPage.loading" />
      </h4>
      <div style={{ height: 150 }}>
        <LoadingComponent />
      </div>
    </div>
  );
};

const ClosingPage = props =>
  // const percent =
  //   (filesPercent(props.loanRequest, requestFiles, 'closing') +
  //     filesPercent(props.borrowers, borrowerFiles, 'closing')) /
  //   (1 + props.borrowers.length);

  (
    <ProcessPage {...props} stepNb={3} id="closing" showBottom={false}>
      <div className="mask1">
        <div className="description">
          <p>
            <T id="ClosingPage.description" />
          </p>
        </div>

        {/* {getAction(props.loanRequest, percent)} */}
      </div>
    </ProcessPage>
  )
;

ClosingPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ClosingPage;
