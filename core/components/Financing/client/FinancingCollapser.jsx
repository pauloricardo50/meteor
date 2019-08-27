// @flow
import React from 'react';
import { withState, compose } from 'recompose';

import ClientEventService from '../../../api/events/ClientEventService';
import Button from '../../Button';
import T from '../../Translation';
import FinancingDataContainer from './containers/FinancingDataContainer';

type FinancingCollapserProps = {};

const FinancingCollapser = ({
  shouldExpand,
  setShouldExpand,
}: FinancingCollapserProps) => (
  <div className="financing-collapser">
    <Button
      raised
      onClick={() => {
        ClientEventService.emit(shouldExpand ? 'expandAll' : 'collapseAll');
        setShouldExpand(!shouldExpand);
      }}
    >
      <T
        id={
          shouldExpand
            ? 'FinancingCollapser.expand'
            : 'FinancingCollapser.collapse'
        }
      />
    </Button>
  </div>
);

export default compose(
  FinancingDataContainer,
  withState('shouldExpand', 'setShouldExpand', ({ Calculator, loan }) =>
    Calculator.hasCompleteStructure({ loan })),
)(FinancingCollapser);
