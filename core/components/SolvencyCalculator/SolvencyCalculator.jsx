// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';

import { createRoute } from 'core/utils/routerUtils';
import { RESIDENCE_TYPE } from 'core/api/constants';
import SolvencyCalculatorContainer, {
  STATE,
} from './SolvencyCalculatorContainer';
import T, { Money } from '../Translation';
import { CANTONS } from '../../api/loans/loanConstants';
import { AutoFormDialog } from '../AutoForm2';
import Button from '../Button';
import Toggle from '../Toggle';

type SolvencyCalculatorProps = {
  state: String,
  loan: Object,
  calculateSolvency: Function,
};

const renderDialog = ({ loan, state, calculateSolvency, style = {} }) => {
  const schema = new SimpleSchema({
    canton: {
      type: String,
      allowedValues: Object.keys(CANTONS),
      uniforms: { displayEmpty: false, placeholder: '' },
    },
  });

  const { maxSolvency: model } = loan;

  return (
    <AutoFormDialog
      model={model}
      schema={schema}
      onSubmit={calculateSolvency}
      title="Calculer ma capacité d'achat maximale"
      description={<p className="description">Afin de calculer les frais de notaire, veuillez renseigner le canton dans lequel vous souhaitez acheter un bien immobilier.</p>}
      buttonProps={{
        raised: true,
        primary: true,
        label: state === STATE.EMPTY ? 'Calculer' : 'Recalculer',
        style: { aligSelf: 'center', marginTop: '8px', ...style },
      }}
    />
  );
};

const renderEmptyState = ({ loan, state, calculateSolvency }) => (
  <div className="solvency-calculator-empty-state">
    <FontAwesomeIcon className="icon" icon={faUsers} />
    <div className="flex-col center">
      {state === STATE.MISSING_INFOS ? (
        <>
          <h3>Complétez vos informations</h3>
          <p className="description">
            Vous pourrez calculer votre solvabilité une fois que vous aurez
            renseigné vos revenus et votre fortune
          </p>
          <Button
            link
            primary
            to={createRoute('/loans/:loanId/borrowers', { loanId: loan._id })}
          >
            Emprunteurs
          </Button>
        </>
      ) : (
        <>
          <h3>Calculez votre capacité d'achat maximale</h3>
          {renderDialog({
            loan,
            calculateSolvency,
            state,
            style: { margin: 32 },
          })}
        </>
      )}
    </div>
  </div>
);

const renderSolvency = ({
  loan,
  calculateSolvency,
  state,
  residenceType,
  setResidenceType,
}) => {
  const {
    maxSolvency: { main, second, canton },
  } = loan;
  return (
    <div className="solvency-calculator-results">
      <h2>Capacité d'achat maximale</h2>
      <h2>
        {canton && (
          <small className="secondary">
            <T id={`Forms.canton.${canton}`} />
          </small>
        )}
      </h2>
      <Toggle
        toggled={residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE}
        onToggle={() =>
          setResidenceType(residenceType === RESIDENCE_TYPE.SECOND_RESIDENCE
            ? RESIDENCE_TYPE.MAIN_RESIDENCE
            : RESIDENCE_TYPE.SECOND_RESIDENCE)
        }
        labelLeft="Résidence secondaire"
        labelRight="Résidence principale"
      />
      <table>
        <tr>
          <td>
            <h4 className="secondary">Emprunt</h4>
          </td>
          <td>
            <h3>
              {residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE ? (
                <Money value={main.propertyValue * main.borrowRatio} />
              ) : (
                <Money value={second.propertyValue * second.borrowRatio} />
              )}
            </h3>
          </td>
        </tr>
        <tr>
          <td>
            <h4 className="secondary">Prix d'achat max.</h4>
          </td>
          <td>
            <h3>
              {residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE ? (
                <Money value={main.propertyValue} />
              ) : (
                <Money value={second.propertyValue} />
              )}
            </h3>
          </td>
        </tr>
        <tr>
          <td>
            <h4 className="secondary">Fonds propres</h4>
          </td>
          <td>
            <h3>
              {residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE ? (
                <Money value={main.propertyValue * (1 - main.borrowRatio)} />
              ) : (
                <Money
                  value={second.propertyValue * (1 - second.borrowRatio)}
                />
              )}
            </h3>
          </td>
        </tr>
      </table>
      {renderDialog({ loan, calculateSolvency, state })}
    </div>
  );
};

const renderState = (props) => {
  if (props.state !== STATE.DONE) {
    return renderEmptyState(props);
  }

  return renderSolvency(props);
};

const SolvencyCalculator = (props: SolvencyCalculatorProps) => {
  return (
    <div className="flex-row center">
      <div className="card1 solvency-calculator">
        {renderState(props)}
      </div>
    </div>
  );
};

export default SolvencyCalculatorContainer(SolvencyCalculator);
