// @flow
import React from 'react';
import T from 'core/components/Translation';

import StarRating from 'core/components/OfferList/StarRating.jsx';

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
    <StarRating value={grade} />
    {text && <p>{text}</p>}
  </div>
);

export default MiocrolocationFactorGrade;
