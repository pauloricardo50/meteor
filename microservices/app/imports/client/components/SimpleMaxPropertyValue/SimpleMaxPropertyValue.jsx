// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';
import cx from 'classnames';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import Loading from 'core/components/Loading';
import Button from 'core/components/Button';
import MaxPropertyValueResults from 'core/components/MaxPropertyValue/MaxPropertyValueResults';
import MaxPropertyValueContainer, {
  STATE,
} from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import { CANTONS } from 'core/api/constants';
import SimpleMaxPropertyValueSignup from './SimpleMaxPropertyValueSignup';

type SimpleMaxPropertyValueProps = {};

const getReadyToCalculateTitle = (props) => {
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
        Dans le cadre de la promotion "{promotionName}", calculez votre capacité d'achat pour le canton de <T id={`Forms.canton.${canton}`} />
      </span>
    );
  }

  if(hasProProperty){
    const propertyName = properties[0].address1;
    return (
      <span>
        Pour le bien immobilier "{propertyName}", calculez votre capacité d'achat pour le canton de <T id={`Forms.canton.${canton}`} />
      </span>
    );
  }
};

export const SimpleMaxPropertyValue = (props: MaxPropertyValueProps) => {
  const {
    blue,
    state,
    onChangeCanton,
    canton: cantonValue,
    loading,
    loan,
    lockCanton,
    recalculate,
    cantonOptions
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
              <h4>{getReadyToCalculateTitle(props)}</h4>
              <div className="flex-row center space-children">
                {!lockCanton && (
                  <Select
                    value={cantonValue}
                    onChange={onChangeCanton}
                    options={cantonOptions}
                    disabled={loading}
                  />
                )}
                <Button
                  raised
                  onClick={recalculate}
                  secondary
                  style={{ marginLeft: 16 }}
                >
                  {lockCanton ? "Calculer ma capacité d'achat" : 'Valider'}
                </Button>
              </div>
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
