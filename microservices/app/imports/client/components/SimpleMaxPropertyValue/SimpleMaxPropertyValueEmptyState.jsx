//      
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScroll } from '@fortawesome/pro-light-svg-icons/faScroll';

import { STATE } from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import { MaxPropertyValueEmptyStateReady } from 'core/components/MaxPropertyValue/MaxPropertyValueEmptyState';
import T from 'core/components/Translation';

                                                

const SimpleMaxPropertyValueEmptyState = (
  props                                       ,
) => {
  const { state } = props;

  return (
    <>
      <h2>
        <T id="MaxPropertyValue.title" />
      </h2>
      <div className="max-property-value-empty-state">
        {state === STATE.MISSING_INFOS ? (
          <>
            <FontAwesomeIcon className="icon" icon={faScroll} />

            <h4 className="secondary">
              <T id="MaxPropertyValue.missingInfos" />
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
