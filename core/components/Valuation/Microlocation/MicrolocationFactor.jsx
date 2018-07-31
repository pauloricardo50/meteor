// @flow
import React from 'react';
import T from 'core/components/Translation';

import MicrolocationFactorGrade from './MicrolocationFactorGrade';

type MicrolocationFactorProps = {
  label: String,
  factors: Object,
};

const renderGrades = factors =>
  Object.keys(factors)
    .filter(factor => factor !== 'grade')
    .map(factor => (
      <MicrolocationFactorGrade
        key={factor}
        label={factor}
        grade={factors[factor].grade}
        text={factors[factor].text}
      />
    ));

const MicrolocationFactor = ({
  label,
  factors: { grade, ...factors },
}: MicrolocationFactorProps) => (
  <div className="microlocation-factor">
    <h3>
      <T id={`Microlocation.${label}Label`} />
      <MicrolocationFactorGrade grade={grade} />
    </h3>
    {renderGrades(factors)}
  </div>
);

export default MicrolocationFactor;
