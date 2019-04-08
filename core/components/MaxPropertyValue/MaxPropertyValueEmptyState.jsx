// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';

import { CANTONS } from '../../api/constants';
import { createRoute } from '../../utils/routerUtils';
import Button from '../Button';
import { STATE } from './MaxPropertyValueContainer';
import Select from '../Select';

type MaxPropertyValueEmptyStateProps = {
  loan: Object,
  state: String,
  calculateSolvency: Function,
};

const MaxPropertyValueEmptyState = ({
  loan,
  state,
  calculateSolvency,
  cantonValue,
  onChangeCanton,
  loading,
}: MaxPropertyValueEmptyStateProps) => (
  <div className="max-property-value-empty-state">
    <FontAwesomeIcon className="icon" icon={faUsers} />
    <div className="flex-col center">
      {state === STATE.MISSING_INFOS ? (
        <>
          <h3>Complétez vos informations</h3>
          <p className="description">
            Vous pourrez calculer votre capacité d'achat maximale une fois que
            vous aurez renseigné vos revenus et votre fortune
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
          <h4>Calculez votre capacité d'achat maximale</h4>
          <Select
            value={cantonValue}
            onChange={onChangeCanton}
            options={Object.keys(CANTONS).map((shortCanton) => {
              const cant = CANTONS[shortCanton];
              return { id: shortCanton, label: cant };
            })}
            disabled={loading}
          />
        </>
      )}
    </div>
  </div>
);

export default MaxPropertyValueEmptyState;
