import React from 'react';
import { faScroll } from '@fortawesome/pro-light-svg-icons/faScroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { STATE } from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import { MaxPropertyValueEmptyStateReady } from 'core/components/MaxPropertyValue/MaxPropertyValueEmptyState';
import T from 'core/components/Translation';

const SimpleMaxPropertyValueEmptyState = props => {
  const {
    state,
    loan: { purchaseType },
  } = props;

  return (
    <>
      <h2>
        <T id="MaxPropertyValue.title" values={{ purchaseType }} />
      </h2>
      <div className="max-property-value-empty-state">
        {state === STATE.MISSING_INFOS ? (
          <>
            <FontAwesomeIcon className="icon" icon={faScroll} />

            <h4 className="secondary">
              <T id="MaxPropertyValue.missingInfos" values={{ purchaseType }} />
            </h4>
            <p className="secondary">
              <i>
                <T id="MaxPropertyValue.informations" />
              </i>
            </p>
          </>
        ) : (
          <MaxPropertyValueEmptyStateReady {...props} />
        )}
      </div>
    </>
  );
};

export default SimpleMaxPropertyValueEmptyState;
