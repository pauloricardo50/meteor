import React from 'react';
import PropTypes from 'prop-types';

import { loanUpdate } from 'core/api';
import ProcessPage from '../../components/ProcessPage';
import RankStrategy from './RankStrategy';
import AmortizingPicker from './AmortizingPicker';
import InsuranceStrategy from './InsuranceStrategy';
import LoanStrategyPicker from './LoanStrategyPicker';

const getComponents = (props, handleSave) => {
  const childProps = {
    ...props,
    handleSave,
    disabled: props.loan.logic.step > 2,
  };

  return [
    {
      component: <RankStrategy {...childProps} key="rank" />,
      condition: false,
      next: true,
    },
    {
      component: <InsuranceStrategy {...childProps} key="insurance" />,
      condition: props.loan.general.insuranceFortuneUsed > 0,
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

const createHandleSave = loanId => object => loanUpdate.run({ object, loanId });

const StrategyPage = (props) => {
  const { loan } = props;
  return (
    <ProcessPage {...props} stepNb={2} id="strategy">
      <section className="mask1">
        {getComponents(props, createHandleSave(loan._id))
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
};

StrategyPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default StrategyPage;
