// @flow
import React from 'react';
import T from 'core/components/Translation';

import StarRating from 'core/components/StarRating';

type MiocrolocationFactorGradeProps = {
  label?: String,
  grade: Number,
  text?: String,
};

const MiocrolocationFactorGrade = ({
  label,
  grade,
  text,
}: MiocrolocationFactorGradeProps) => (
  <div className="microlocation-rating">
    {label && (
      <h4>
        <T id={`Microlocation.${label}Label`} />
      </h4>
    )}
    {text && <p>{text}</p>}
    <StarRating value={grade} />
  </div>
);

export default MiocrolocationFactorGrade;
