import React, { Component } from 'react';
import PropTypes from 'prop-types';

import cleanMethod from '/imports/api/cleanMethods';
import ProcessPage from '/imports/ui/components/general/ProcessPage';
import RankStrategy from './RankStrategy';
import AmortizingPicker from './AmortizingPicker';
import InsuranceStrategy from './InsuranceStrategy';
import LoanStrategyPicker from './LoanStrategyPicker';

const getComponents = (props, handleSave) => {
  const childProps = {
    ...props,
    handleSave,
  };

  return [
    {
      component: <RankStrategy {...childProps} key="rank" />,
      condition: false,
      next: true,
    },
    {
      component: <InsuranceStrategy {...childProps} key="insurance" />,
      condition: props.loanRequest.general.insuranceFortuneUsed > 0,
    },
    {
      component: <AmortizingPicker {...childProps} key="amortizing" />,
      condition: true,
    },
    {
      component: <LoanStrategyPicker {...childProps} key="loanStrategy" />,
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
            .reduce((prev, curr, i) => [
              prev,
              <hr style={{ margin: '32px 0' }} key={i} />,
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
