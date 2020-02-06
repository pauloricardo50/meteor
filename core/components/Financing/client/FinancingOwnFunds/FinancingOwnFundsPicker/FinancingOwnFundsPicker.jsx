import React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import Icon from 'core/components/Icon';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import OwnFundsAdder from './OwnFundsAdder';
import CurrentOwnFunds from './CurrentOwnFunds';

const FinancingOwnFundsPicker = ({
  structureId,
  structure,
  history,
  ...data
}) => {
  const {
    borrowers = [],
    loan: { _id: loanId },
  } = data;

  if (!borrowers.length) {
    return (
      <div className="flex-col ownFundsPicker">
        <p className="description">
          Vous pourrez allouer vos fonds propres lorsque vous aurez ajouté des
          emprunteurs
        </p>
        <Button
          onClick={() => {
            history.push(createRoute('/loans/:loanId/borrowers', { loanId }));
          }}
          primary
          raised
        >
          <div className="flex-row center space-children">
            <Icon type="person" />
            <p style={{ margin: 'unset' }}>Ajouter des emprunteurs</p>
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="ownFundsPicker">
      {structure.ownFunds.map((ownFunds, index) => (
        <CurrentOwnFunds
          key={`${ownFunds.borrowerId}${ownFunds.type}${ownFunds.usageType}`}
          ownFundsIndex={index}
          ownFunds={ownFunds}
          structureId={structureId}
          structure={structure}
          {...data}
        />
      ))}
      <OwnFundsAdder
        structureId={structureId}
        disabled={structure.disableForms}
      />
    </div>
  );
};

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
  withRouter,
)(FinancingOwnFundsPicker);
