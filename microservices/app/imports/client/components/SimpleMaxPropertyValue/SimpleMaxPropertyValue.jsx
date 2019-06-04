// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';
import cx from 'classnames';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import Loading from 'core/components/Loading';
import MaxPropertyValueResults from 'core/components/MaxPropertyValue/MaxPropertyValueResults';
import MaxPropertyValueContainer, {
  STATE,
} from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import { CANTONS } from 'core/api/constants';
import SimpleMaxPropertyValueSignup from './SimpleMaxPropertyValueSignup';

type SimpleMaxPropertyValueProps = {};

export const SimpleMaxPropertyValue = (props: MaxPropertyValueProps) => {
  const {
    blue,
    state,
    onChangeCanton,
    canton: cantonValue,
    loading,
    loan,
  } = props;

  if (loading) {
    return (
      <div className="simple-max-property-value loading">
        <div className="animated fadeIn">
          <Loading />
          <h4>Algorithmes au travail...</h4>
          <p>Détendez-vous un instant</p>
        </div>
      </div>
    );
  }

  if (state !== STATE.DONE) {
    return (
      <div className="simple-max-property-value">
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
            </>
          ) : (
            <>
              <h4>
                <T id="MaxPropertyValue.empty" />
              </h4>
              <Select
                value={cantonValue}
                onChange={onChangeCanton}
                options={Object.keys(CANTONS).map((shortCanton) => {
                  const canton = CANTONS[shortCanton];
                  return { id: shortCanton, label: canton };
                })}
                disabled={loading}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  if (loan.maxPropertyValueExists) {
    return <SimpleMaxPropertyValueSignup />;
  }

  return (
    <div className={cx('simple-max-property-value', { blue })}>
      <MaxPropertyValueResults {...props} />
    </div>
  );
};

export default MaxPropertyValueContainer(SimpleMaxPropertyValue);
