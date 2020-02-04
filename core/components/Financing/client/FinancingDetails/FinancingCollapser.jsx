//      
import React, { useState } from 'react';

import ClientEventService from '../../../../api/events/ClientEventService';
import Button from '../../../Button';
import T from '../../../Translation';

                                  

const FinancingCollapser = ({ Calculator, loan }                         ) => {
  const [shouldExpand, setShouldExpand] = useState(() =>
    Calculator.hasCompleteStructure({ loan }),
  );

  return (
    <Button
      raised
      onClick={() => {
        ClientEventService.emit(shouldExpand ? 'expandAll' : 'collapseAll');
        setShouldExpand(!shouldExpand);
      }}
      className="mr-16"
    >
      <T
        id={
          shouldExpand
            ? 'FinancingCollapser.expand'
            : 'FinancingCollapser.collapse'
        }
      />
    </Button>
  );
};

export default FinancingCollapser;
