import React, { Component } from 'react';
import PropTypes from 'prop-types';

import cleanMethod from '/imports/api/cleanMethods';
import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';
import RankStrategy from './strategyPage/RankStrategy.jsx';
import AmortizingPicker from './strategyPage/AmortizingPicker.jsx';
import InsuranceStrategy from './strategyPage/InsuranceStrategy.jsx';
import LoanStrategyPicker from './strategyPage/LoanStrategyPicker.jsx';

const getComponents = (props, handleSave) => {
  const childProps = {
    ...props,
    handleSave,
  };

  return [
    {
      component: RankStrategy,
      condition: false,
      next: true,
    },
    {
      component: <InsuranceStrategy {...childProps} />,
      condition: props.loanRequest.general.insuranceFortuneUsed > 0,
    },
    {
      component: <AmortizingPicker {...childProps} />,
      condition: true,
    },
    {
      component: <LoanStrategyPicker {...childProps} />,
      condition: true,
    },
  ];
};

export default class StrategyPage extends Component {
  handleSave = (object) => {
    cleanMethod('updateRequest', object, this.props.loanRequest._id);
  };

  render() {
    return (
      <ProcessPage {...this.props} stepNb={2} id="strategy">
        <section className="mask1">
          {getComponents(this.props, this.handleSave)
            .filter(i => i.condition)
            .map(i => i.component)
            .reduce((prev, curr) => [
              prev,
              <hr style={{ margin: '32px 0' }} />,
              curr,
            ])}
        </section>
      </ProcessPage>
    );
  }
}

StrategyPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
