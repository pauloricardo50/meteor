// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';

import { createRoute } from '../../utils/routerUtils';
import Button from '../Button';
import MaxPropertyValueDialog from './MaxPropertyValueDialog';
import { STATE } from './MaxPropertyValueContainer';

type MaxPropertyValueEmptyStateProps = {
  loan: Object,
  state: String,
  calculateSolvency: Function,
};

const MaxPropertyValueEmptyState = ({
  loan,
  state,
  calculateSolvency,
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
          <MaxPropertyValueDialog
            loan={loan}
            calculateSolvency={calculateSolvency}
            state={state}
            style={{ marginTop: 16 }}
          />
        </>
      )}
    </div>
  </div>
);

export default MaxPropertyValueEmptyState;
