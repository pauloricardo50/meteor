import React, { useState } from 'react';

import { loanSearch } from 'core/api/loans/queries';
import { LOANS_COLLECTION } from 'core/api/constants';
import Button from 'core/components/Button';
import CollectionSearch from 'core/components/CollectionSearch';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import Dialog from 'core/components/Material/Dialog';
import Icon from 'core/components/Icon';
import { insuranceRequestLinkLoan } from 'core/api/methods/index';

const InsuranceRequestLoanLinker = props => {
  const { insuranceRequest } = props;
  const {
    user: { _id: userId },
  } = insuranceRequest;

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
              <CollectionIconLink
                relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
                placement="left"
              />
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
