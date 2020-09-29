import React from 'react';
import { faScroll } from '@fortawesome/pro-light-svg-icons/faScroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { PURCHASE_TYPE } from '../../api/loans/loanConstants';
import { createRoute } from '../../utils/routerUtils';
import Button from '../Button';
import Icon from '../Icon';
import Select from '../Select';
import T from '../Translation';
import { STATE } from './MaxPropertyValueContainer';

export const getReadyToCalculateTitle = props => {
  const { loan, lockCanton, canton } = props;
  const {
    hasPromotion,
    hasProProperty,
    properties = [],
    promotions = [],
    purchaseType,
  } = loan;

  if (!lockCanton) {
    return (
      <T defaultMessage="Choisissez le canton dans lequel se situe le bien immobilier. Vous pourrez le changer plus tard." />
    );
  }

  if (hasPromotion) {
    const promotionName = promotions[0].name;
    return (
      <T
        defaultMessage={
          'Dans le cadre de la promotion "{promotionName}", calculez votre capacité d\'achat et obtenez un accord de principe pour le canton de {canton}'
        }
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
      <T
        defaultMessage={
          'Obtenez un accord de principe pour le bien immobilier "{propertyName}"'
        }
        values={{ propertyName }}
      />
    );
  }

  if (purchaseType === PURCHASE_TYPE.REFINANCING) {
    return (
      <T defaultMessage="Calculez votre capacité d'emprunt auprès de tous les prêteurs du marché" />
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
          <T defaultMessage="Calculer" />
        ) : (
          <T defaultMessage="Valider" />
        )}
      </Button>
    </div>
  </>
);

const MaxPropertyValueEmptyState = props => {
  const {
    loan: { _id: loanId, purchaseType },
    state,
  } = props;
  return (
    <div className="max-property-value-empty-state animated fadeIn">
      <FontAwesomeIcon className="icon" icon={faScroll} />
      <div className="flex-col center">
        {state === STATE.MISSING_INFOS ? (
          <>
            <div className="font-size-5">
              <T defaultMessage="Complétez vos informations" />
            </div>
            <p className="description">
              <T
                defaultMessage="Complétez le formulaire pour pouvoir calculer votre capacité {purchaseType, select, REFINANCING {d'emprunt} other {d'achat}} auprès de tous les prêteurs"
                values={{ purchaseType }}
              />
            </p>
            <Button
              link
              primary
              to={createRoute('/loans/:loanId/borrowers/finance', { loanId })}
            >
              <T defaultMessage="Emprunteurs" />
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
