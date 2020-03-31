import React, { useState } from 'react';

import { borrowerSearch } from 'core/api/borrowers/queries';
import { BORROWERS_COLLECTION } from 'core/api/constants';
import Button from 'core/components/Button';
import CollectionSearch from 'core/components/CollectionSearch';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import Dialog from 'core/components/Material/Dialog';
import Icon from 'core/components/Icon';
import { insuranceRequestLinkBorrower } from 'core/api/methods';

const InsuranceRequestBorrowerReuser = props => {
  const { insuranceRequest, className, buttonProps = {} } = props;
  const { user: { _id: userId } = {}, borrowers = [] } = insuranceRequest;

  if (!userId) {
    return (
      <span style={{ maxWidth: 200, marginLeft: 8, textAlign: 'center' }}>
        Ajoutez un compte sur ce dossier pour réutiliser des assurés existants
      </span>
    );
  }

  const [openDialog, setOpenDialog] = useState(false);

  if (borrowers.length === 2) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setOpenDialog(true)}
        primary
        raised
        label="Réutiliser un assuré"
        icon={<Icon type="search" />}
        className={className}
        size="small"
        {...buttonProps}
      />
      <Dialog
        title="Réutiliser un assuré"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        actions={[]}
      >
        <CollectionSearch
          query={borrowerSearch}
          queryParams={{ userId }}
          title="Rechercher un profil emprunteur ou assuré existant"
          type="list"
          renderItem={borrower => (
            <div className="flex center-align sb" style={{ width: '100%' }}>
              <CollectionIconLink
                relatedDoc={{ ...borrower, collection: BORROWERS_COLLECTION }}
                placement="left"
              />
              <Button
                onClick={() =>
                  insuranceRequestLinkBorrower
                    .run({
                      insuranceRequestId: insuranceRequest._id,
                      borrowerId: borrower._id,
                    })
                    .then(() => setOpenDialog(false))
                }
                primary
                disabled={borrowers
                  .map(({ _id }) => _id)
                  .includes(borrower._id)}
                label="Réutiliser"
              />
            </div>
          )}
        />
      </Dialog>
    </>
  );
};

export default InsuranceRequestBorrowerReuser;
