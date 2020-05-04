import React, { useContext } from 'react';

import { PropertyAdder } from 'core/components/PropertyForm';
import T from 'core/components/Translation';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import useMedia from 'core/hooks/useMedia';

const triggerComponent = ({ onClick }) => (
  <div
    className="card1 card-top card-hover mb-16 text-center pointer flex-col property-form"
    onClick={onClick}
  >
    <span className="plus">+</span>
    <h3>
      <T id="SimpleDashboardPage.refinancingProperty" />
    </h3>
  </div>
);

const SimpleDashboardPagePropertyAdder = ({ loanId }) => {
  const currentUser = useContext(CurrentUserContext);
  const fullScreen = useMedia({ maxWidth: 768 });

  return (
    <PropertyAdder
      loanId={loanId}
      userId={currentUser?._id}
      triggerComponent={triggerComponent}
      isRefinancing
      fullScreen={fullScreen}
    />
  );
};

export default SimpleDashboardPagePropertyAdder;
