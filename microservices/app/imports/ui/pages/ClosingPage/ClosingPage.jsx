import React from 'react';
import PropTypes from 'prop-types';

import ProcessPage from '/imports/ui/components/ProcessPage';
import { T } from 'core/components/Translation';

import Empty from './Empty';
import Content from './Content';

const ClosingPage = (props) => {
  const { loan } = props;
  return (
    <ProcessPage
      {...props}
      sectionId="closing-page"
      stepNb={3}
      id="closing"
      showBottom={false}
    >
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
    </ProcessPage>
  );
};

ClosingPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ClosingPage;
