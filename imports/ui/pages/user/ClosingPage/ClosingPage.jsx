import React from 'react';
import PropTypes from 'prop-types';

import ProcessPage from '/imports/ui/components/general/ProcessPage';
import { T } from '/imports/ui/components/general/Translation';

import Empty from './Empty';
import Content from './Content';

const ClosingPage = (props) => {
  const { loanRequest } = props;
  return (
    <ProcessPage {...props} stepNb={3} id="closing" showBottom={false}>
      <div className="mask1">
        {loanRequest.logic.lastSteps && loanRequest.logic.lastSteps.length ? (
          <Content steps={loanRequest.logic.lastSteps} />
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
