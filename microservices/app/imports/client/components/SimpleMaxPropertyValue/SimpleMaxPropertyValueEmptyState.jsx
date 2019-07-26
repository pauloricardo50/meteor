// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';
import cx from 'classnames';

import { STATE } from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import { getReadyToCalculateTitle } from 'core/components/MaxPropertyValue/MaxPropertyValueEmptyState';
import T from 'core/components/Translation';
import Select from 'core/components/Select';
import Button from 'core/components/Button';

type SimpleMaxPropertyValueEmptyStateProps = {};

const SimpleMaxPropertyValueEmptyState = (props: SimpleMaxPropertyValueEmptyStateProps) => {
  const {
    state,
    lockCanton,
    canton: cantonValue,
    onChangeCanton,
    cantonOptions,
    loading,
    recalculate,
    fixed,
    error,
  } = props;

  return (
    <div className={cx('simple-max-property-value', { fixed })}>
      <h2>
        <T id="MaxPropertyValue.title" />
      </h2>
      <div className="empty">
        {state === STATE.MISSING_INFOS ? (
          <>
            <FontAwesomeIcon className="icon" icon={faUsers} />

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
          <>
            <h4>{getReadyToCalculateTitle(props)}</h4>
            <div
              className={cx('flex-row center space-children', {
                animated: !cantonValue,
                bounceIn: !cantonValue,
              })}
            >
              {!lockCanton && (
                <Select
                  value={cantonValue}
                  onChange={onChangeCanton}
                  options={cantonOptions}
                  disabled={loading}
                  placeholder={(
                    <i>
                      <T id="general.pick" />
                    </i>
                  )}
                  error={error && <span className="error-box">{error}</span>}
                />
              )}
              <Button
                raised
                onClick={recalculate}
                secondary
                style={{ marginLeft: 16, marginTop: 0 }}
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
};

export default SimpleMaxPropertyValueEmptyState;
