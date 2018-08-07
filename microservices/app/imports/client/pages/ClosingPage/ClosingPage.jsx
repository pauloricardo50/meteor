import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../components/Page';

import Empty from './Empty';
import Content from './Content';

const ClosingPage = (props) => {
  const { loan } = props;
  return (
    <Page id="ClosingPage">
      <section className="mask1 closing-page">
        {loan.logic.closingSteps && loan.logic.closingSteps.length ? (
          <Content
            steps={loan.logic.closingSteps}
            loan={loan}
            disabled={loan.logic.step > 3}
          />
        ) : (
          <Empty />
        )}
      </section>
    </Page>
  );
};

ClosingPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ClosingPage;
