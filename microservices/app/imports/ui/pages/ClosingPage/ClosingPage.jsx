import React from 'react';
import PropTypes from 'prop-types';

import ProcessPage from '/imports/ui/components/ProcessPage';
import { T } from 'core/components/Translation';

import Empty from './Empty';
import Content from './Content';

const ClosingPage = (props) => {
  const { loanRequest } = props;
  return (
    <ProcessPage {...props} stepNb={3} id="closing" showBottom={false}>
      <div className="mask1 flex-col">
        {loanRequest.logic.closingSteps && loanRequest.logic.closingSteps.length ? (
          <Content
            steps={loanRequest.logic.closingSteps}
            loanRequest={loanRequest}
            disabled={loanRequest.logic.step > 3}
          />
        ) : (
          <Empty />
        )}
      </div>
    </ProcessPage>
  );
};

ClosingPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ClosingPage;
