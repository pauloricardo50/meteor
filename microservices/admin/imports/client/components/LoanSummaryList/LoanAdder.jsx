import React from 'react';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import Button from 'core/components/Button';
import DialogSimple from 'core/components/DialogSimple';
import Icon from 'core/components/Icon';
import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';
import T from 'core/components/Translation';

import LoanAdderContainer from './LoanAdderContainer';

const LoanAdder = ({ onSubmit }) => (
  <DialogSimple
    buttonProps={{
      icon: <Icon type="add" />,
      primary: true,
      raised: true,
      label: 'Hypothèque',
      className: 'ml-8',
    }}
    title="Nouvelle hypothèque"
    closeOnly
  >
    <>
      <p className="description">Choisissez le type de dossier</p>
      <div className="flex">
        <Button
          raised
          secondary
          onClick={() => onSubmit({ purchaseType: PURCHASE_TYPE.ACQUISITION })}
          icon={<AcquisitionIcon fontSize="1.5em" />}
        >
          <T id="Forms.purchaseType.ACQUISITION" />
        </Button>
        <Button
          raised
          secondary
          onClick={() => onSubmit({ purchaseType: PURCHASE_TYPE.REFINANCING })}
          icon={<RefinancingIcon fontSize="1.5em" />}
          className="ml-8"
        >
          <T id="Forms.purchaseType.REFINANCING" />
        </Button>
      </div>
    </>
  </DialogSimple>
);

export default LoanAdderContainer(LoanAdder);
