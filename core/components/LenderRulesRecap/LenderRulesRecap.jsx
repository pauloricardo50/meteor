import React from 'react';

import { lenderRulesParts } from '../../api/lenderRules/schemas/lenderRulesSchema';
import Calculator, {
  Calculator as CalculatorClass,
} from '../../utils/Calculator';
import T, { Percent } from '../Translation';

const getValue = (calc, key) => {
  const raw = calc[key];

  if (raw === undefined) {
    return;
  }

  if (typeof raw === 'string') {
    return <T id={`Forms.${key}.${raw}`} />;
  }

  if (typeof raw === 'number') {
    if (raw >= 0 && raw <= 1) {
      return <Percent value={raw} />;
    }

    return raw;
  }

  if (typeof raw === 'boolean') {
    return <T id={`general.${raw}` ? 'yes' : 'no'} />;
  }
};

const LenderRulesRecap = ({ loan, structureId }) => {
  const calculator = new CalculatorClass({
    loan,
    structureId,
    lenderRules: Calculator.selectLenderRules({ loan, structureId }),
  });

  return (
    <div style={{ fontSize: '1.2em' }}>
      <h5 style={{ color: 'white' }}>
        Critères d'octroi: <b>{calculator.organisationName || 'e-Potek'}</b>
      </h5>

      {lenderRulesParts.map(({ title, keys }) => (
        <div key={title}>
          <b className="mt-16 mb-8" style={{ display: 'block' }}>
            {title}
          </b>
          {keys
            .map(key => ({ key, value: getValue(calculator, key) }))
            .filter(({ value }) => value !== undefined)
            .map(({ key, value }) => (
              <div key={key}>
                <span>
                  <T id={`Forms.${key}`} />
                </span>
                :&nbsp;
                <b>{value}</b>
              </div>
            ))}
        </div>
      ))}

      {calculator.adminComments?.length ? (
        <div>
          <b className="mt-16 mb-8" style={{ display: 'block' }}>
            Commentaires Admin
          </b>
          <ul>
            {calculator.adminComments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {calculator.pdfComments?.length ? (
        <div>
          <b className="mt-16 mb-8" style={{ display: 'block' }}>
            Commentaires PDF
          </b>
          <ul>
            {calculator.pdfComments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default LenderRulesRecap;
