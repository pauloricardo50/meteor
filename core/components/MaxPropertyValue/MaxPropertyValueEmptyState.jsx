//
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScroll } from '@fortawesome/pro-light-svg-icons/faScroll';
import cx from 'classnames';

import { createRoute } from '../../utils/routerUtils';
import Button from '../Button';
import Select from '../Select';
import T from '../Translation';
import { STATE } from './MaxPropertyValueContainer';
import Icon from '../Icon';

export const getReadyToCalculateTitle = props => {
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
      <T
        id="MaxPropertyValue.empty.promotion"
        values={{
          promotionName,
          canton: <T id={`Forms.canton.${canton}`} />,
        }}
      />
    );
  }

  if (hasProProperty) {
    const propertyName = properties[0].address1;
    return (
      <T id="MaxPropertyValue.empty.proProperty" values={{ propertyName }} />
    );
  }
};

export const MaxPropertyValueEmptyStateReady = ({
  loan,
  onChangeCanton,
  loading,
  lockCanton,
  recalculate,
  cantonOptions,
  canton,
  error,
}) => (
  <>
    <h4 className="max-property-value-ready-title">
      {getReadyToCalculateTitle({ loan, canton, lockCanton })}
    </h4>
    <div
      className={cx('flex-row center space-children', {
        animated: !canton,
        bounceIn: !canton,
      })}
    >
      {!lockCanton && (
        <Select
          value={canton}
          onChange={onChangeCanton}
          options={cantonOptions}
          disabled={loading}
          placeholder={
            <i>
              <T id="general.pick" />
            </i>
          }
          error={error && <span className="error-box">{error}</span>}
          name="max-property-value-canton"
        />
      )}
      <Button
        raised
        onClick={recalculate}
        secondary
        style={{ marginLeft: 16, marginTop: 0 }}
        icon={<Icon type="check" />}
      >
        {lockCanton ? (
          <T id="general.calculate" />
        ) : (
          <T id="general.validate" />
        )}
      </Button>
    </div>
  </>
);

const MaxPropertyValueEmptyState = props => {
  const { loan, state } = props;
  return (
    <div className="max-property-value-empty-state animated fadeIn">
      <FontAwesomeIcon className="icon" icon={faScroll} />
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
          <MaxPropertyValueEmptyStateReady {...props} />
        )}
      </div>
    </div>
  );
};

export default MaxPropertyValueEmptyState;
