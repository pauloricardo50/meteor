import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { LOAN_CATEGORIES, PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import Icon from 'core/components/Icon';
import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';

const PurchaseTypeIcon = ({ isRefinancing }) =>
  isRefinancing ? (
    <RefinancingIcon className="refinancing-icon" />
  ) : (
    <AcquisitionIcon className="acquisition-icon" />
  );

const LoanBoardCardBottom = ({
  category,
  promotions,
  properties,
  customName,
  structure,
  renderComplex,
  purchaseType,
}) => {
  const promotion = promotions[0] && promotions[0].name;
  const showPremium = category === LOAN_CATEGORIES.PREMIUM;
  const isRefinancing = purchaseType === PURCHASE_TYPE.REFINANCING;

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

  return (
    <div className="card-bottom">
      {renderComplex ? (
        <Tooltip title={isRefinancing ? 'Refinancement' : 'Acquisition'}>
          <span className="flex center">
            <PurchaseTypeIcon isRefinancing={isRefinancing} />
          </span>
        </Tooltip>
      ) : (
        <PurchaseTypeIcon isRefinancing={isRefinancing} />
      )}
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
};

export default LoanBoardCardBottom;
