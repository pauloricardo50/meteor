// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';

import { createRoute } from '../../utils/routerUtils';
import Button from '../Button';
import Select from '../Select';
import T from '../Translation';
import { STATE } from './MaxPropertyValueContainer';

type MaxPropertyValueEmptyStateProps = {
  loan: Object,
  state: String,
  calculateSolvency: Function,
};

export const getReadyToCalculateTitle = (props) => {
  const { loan, lockCanton, canton } = props;
  const {
    hasPromotion,
    hasProProperty,
    properties = [],
    promotions = [],
  } = loan;

  if (!lockCanton) {
    return <T id="MaxPropertyValue.empty" />;
  }

  if (hasPromotion) {
    const promotionName = promotions[0].name;
    return (
      <span>
        <T
          id="MaxPropertyValue.empty.promotion"
          values={{
            promotionName,
            canton: <T id={`Forms.canton.${canton}`} />,
          }}
        />
      </span>
    );
  }

  if (hasProProperty) {
    const propertyName = properties[0].address1;
    return (
      <span>
        <T id="MaxPropertyValue.empty.proProperty" values={{ propertyName }} />
      </span>
    );
  }
};

const MaxPropertyValueEmptyState = ({
  loan,
  state,
  calculateSolvency,
  onChangeCanton,
  loading,
  lockCanton,
  recalculate,
  cantonOptions,
  canton,
}: MaxPropertyValueEmptyStateProps) => (
  <div className="max-property-value-empty-state">
    <FontAwesomeIcon className="icon" icon={faUsers} />
    <div className="flex-col center">
      {state === STATE.MISSING_INFOS ? (
        <>
          <h2>
            <T id="MaxPropertyValue.completeInfo" />
          </h2>
          <p className="description">
            <T id="MaxPropertyValue.missingInfos" />
          </p>
          <Button
            link
            primary
            to={createRoute('/loans/:loanId/borrowers/finance', {
              loanId: loan._id,
            })}
          >
            <T id="collections.borrowers" />
          </Button>
        </>
      ) : (
        <>
          <h4>{getReadyToCalculateTitle({ loan, canton, lockCanton })}</h4>
          <div className="flex-row center space-children">
            {!lockCanton && (
              <Select
                value={canton}
                onChange={onChangeCanton}
                options={cantonOptions}
                disabled={loading}
                placeholder={(
                  <i>
                    <T id="general.pick" />
                  </i>
                )}
              />
            )}
            <Button
              raised
              onClick={recalculate}
              secondary
              style={{ marginLeft: 16 }}
              disabled={!canton}
            >
              {lockCanton ? (
                <T id="general.calculate" />
              ) : (
                <T id="general.validate" />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  </div>
);

export default MaxPropertyValueEmptyState;
