import React from 'react';
import { useHistory } from 'react-router-dom';

import { CollectionIconLink } from 'core/components/IconLink';
import { LOANS_COLLECTION } from 'core/api/constants';
import { insuranceRequestLinkNewLoan } from 'core/api/methods/index';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import { createRoute } from 'core/utils/routerUtils';
import ADMIN_ROUTES from '../../../../../startup/client/adminRoutes';
import InsuranceRequestLoanLinker from './InsuranceRequestLoanLinker';

const InsuranceRequestLinkedLoan = props => {
  const { insuranceRequest } = props;
  const { loan } = insuranceRequest;
  const history = useHistory();

  return (
    <div className="flex-col">
      <h4>Dossier hypothécaire lié</h4>
      {loan ? (
        <CollectionIconLink
          relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
        />
      ) : (
        <div className="flex-col">
          <p className="description">
            Aucun dossier hypothécaire lié. Vous pouvez directement créer une
            nouvelle hypothèque ou en lier une existante.
          </p>
          <div className="flex center-align">
            <Button
              onClick={() =>
                insuranceRequestLinkNewLoan
                  .run({
                    insuranceRequestId: insuranceRequest._id,
                  })
                  .then(loanId =>
                    history.push(
                      createRoute(ADMIN_ROUTES.SINGLE_LOAN_PAGE.path, {
                        loanId,
                      }),
                    ),
                  )
              }
              raised
              primary
              tooltip="Créer une nouvelle hypothèque"
              icon={<Icon type="add" />}
              label="Nouvelle hypothèque"
              className="mr-8"
            />
            <InsuranceRequestLoanLinker insuranceRequest={insuranceRequest} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceRequestLinkedLoan;
