// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';

import { createRoute } from '../../utils/routerUtils';
import Button from '../Button';
import SolvencyCalculatorDialog from './SolvencyCalculatorDialog';
import { STATE } from './SolvencyCalculatorContainer';

type SolvencyCalculatorEmptyStateProps = {
  loan: Object,
  state: String,
  calculateSolvency: Function,
};

const SolvencyCalculatorEmptyState = ({
  loan,
  state,
  calculateSolvency,
}: SolvencyCalculatorEmptyStateProps) => (
  <div className="solvency-calculator-empty-state">
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
          <h3>Calculez votre capacité d'achat maximale</h3>
          <SolvencyCalculatorDialog
            loan={loan}
            calculateSolvency={calculateSolvency}
            state={state}
            style={{ margin: 32 }}
          />
        </>
      )}
    </div>
  </div>
);

export default SolvencyCalculatorEmptyState;
