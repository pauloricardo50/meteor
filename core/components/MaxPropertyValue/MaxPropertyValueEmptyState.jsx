// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';

import { CANTONS } from '../../api/constants';
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
        Dans le cadre de la promotion "
        {promotionName}
        ", calculez votre capacité d'achat pour le canton de
        {' '}
        <T id={`Forms.canton.${canton}`} />
      </span>
    );
  }

  if (hasProProperty) {
    const propertyName = properties[0].address1;
    return (
      <span>
        Pour le bien immobilier "
        {propertyName}
        ", calculez votre capacité d'achat pour le canton de
        {' '}
        <T id={`Forms.canton.${canton}`} />
      </span>
    );
  }
};

const MaxPropertyValueEmptyState = ({
  loan,
  state,
  calculateSolvency,
  cantonValue,
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
          <h2>Complétez vos informations</h2>
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
            Emprunteurs
          </Button>
        </>
      ) : (
        <>
          <h4>{getReadyToCalculateTitle({ loan, canton, lockCanton })}</h4>
          <div className="flex-row center space-children">
            {!lockCanton && (
              <Select
                value={cantonValue}
                onChange={onChangeCanton}
                options={cantonOptions}
                disabled={loading}
                placeholder={<i>Choisissez...</i>}
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
          {/* <Select
            value={cantonValue}
            onChange={onChangeCanton}
            options={Object.keys(CANTONS).map((shortCanton) => {
              const cant = CANTONS[shortCanton];
              return { id: shortCanton, label: cant };
            })}
            disabled={loading}
          /> */}
        </>
      )}
    </div>
  </div>
);

export default MaxPropertyValueEmptyState;
