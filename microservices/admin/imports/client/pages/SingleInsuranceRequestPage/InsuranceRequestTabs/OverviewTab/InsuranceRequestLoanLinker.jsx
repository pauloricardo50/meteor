import React, { useState } from 'react';

import { insuranceRequestLinkLoan } from 'core/api/insuranceRequests/methodDefinitions';
import { loanSearch } from 'core/api/loans/queries';
import Button from 'core/components/Button';
import CollectionSearch from 'core/components/CollectionSearch';
import Icon from 'core/components/Icon';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import Dialog from 'core/components/Material/Dialog';

const InsuranceRequestLoanLinker = props => {
  const { insuranceRequest } = props;
  const { user: { _id: userId } = {} } = insuranceRequest;

  if (!userId) {
    return (
      <span style={{ maxWidth: 200, textAlign: 'center' }}>
        Ajoutez un compte sur ce dossier pour plus d'options
      </span>
    );
  }

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpenDialog(true)}
        primary
        raised
        label="Lier un dossier existant"
        icon={<Icon type="search" />}
      />
      <Dialog
        title="Lier un dossier"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        actions={[]}
      >
        <CollectionSearch
          query={loanSearch}
          queryParams={{ userId }}
          title="Rechercher un dossier existant"
          type="list"
          renderItem={loan => (
            <div className="flex center-align sb" style={{ width: '100%' }}>
              <CollectionIconLink relatedDoc={loan} placement="left" />
              <Button
                onClick={() =>
                  insuranceRequestLinkLoan
                    .run({
                      insuranceRequestId: insuranceRequest._id,
                      loanId: loan._id,
                    })
                    .then(() => setOpenDialog(false))
                }
                primary
                label="Réutiliser"
              />
            </div>
          )}
        />
      </Dialog>
    </>
  );
};

export default InsuranceRequestLoanLinker;
