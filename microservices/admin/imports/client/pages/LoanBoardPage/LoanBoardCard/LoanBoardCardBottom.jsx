//
import React from 'react';

import Icon from 'core/components/Icon';
import { LOAN_CATEGORIES } from 'core/api/constants';

const LoanBoardCardBottom = ({
  category,
  promotions,
  properties,
  customName,
  structure,
  renderComplex,
}) => {
  const promotion = promotions[0] && promotions[0].name;
  const showPremium = category === LOAN_CATEGORIES.PREMIUM;

  let content = null;
  if (promotion) {
    content = promotion;
  } else if (customName) {
    content = customName;
  } else if (structure && structure.propertyId) {
    const property = properties.find(({ _id }) => _id === structure.propertyId);
    if (property.address1) {
      content = property.address1;
    }
  }

  if (content || showPremium) {
    return (
      <div className="card-bottom">
        {showPremium && (
          <span className="premium-badge">
            <Icon
              type="star"
              tooltip={renderComplex && 'Dossier Premium'}
              size={16}
            />
          </span>
        )}
        {content}
      </div>
    );
  }

  return null;
};

export default LoanBoardCardBottom;
