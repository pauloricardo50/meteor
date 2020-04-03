import React from 'react';

import { LOANS_COLLECTION } from '../../../../api/loans/loanConstants';
import { loanSearch } from '../../../../api/loans/queries';
import Button from '../../../Button';
import CollectionSearch from '../../../CollectionSearch/CollectionSearch';
import { CollectionIconLink } from '../../../IconLink';
import PromotionLoanLinkerContainer from './PromotionLoanLinkerContainer';

const PromotionLoanLinker = ({
  promotion,
  unlinkPromotionLoan,
  insertPromotionLoan,
  linkPromotionLoan,
}) => (
  <div className="flex-col">
    <div className="flex-row center space-children">
      {promotion.promotionLoan ? (
        <div className="flex-row center space-children">
          <p className="secondary center" style={{ marginTop: 0 }}>
            Dossier lié:&nbsp;
          </p>
          <CollectionIconLink
            relatedDoc={{
              ...promotion.promotionLoan,
              collection: LOANS_COLLECTION,
            }}
          />
          <Button
            onClick={() =>
              unlinkPromotionLoan({ loanId: promotion.promotionLoan._id })
            }
            error
            outlined
          >
            Délier
          </Button>
        </div>
      ) : (
        <div className="flex-row center space-children">
          <p className="secondary center">
            Aucun dossier de développement lié à cette promotion.
          </p>
          <Button primary raised onClick={() => insertPromotionLoan()}>
            Lier un nouveau dossier
          </Button>
        </div>
      )}
    </div>
    <CollectionSearch
      query={loanSearch}
      title="Rechercher un dossier existant"
      resultsFilter={loans =>
        promotion.promotionLoan
          ? loans.filter(loan => promotion.promotionLoan._id !== loan._id)
          : loans
      }
      renderItem={(loan, hideResults) => (
        <div
          className="flex-row"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <CollectionIconLink
            relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
          />
          <Button
            onClick={() =>
              linkPromotionLoan({ loanId: loan._id }).then(hideResults)
            }
            primary
            disabled={
              promotion.promotionLoan &&
              promotion.promotionLoan._id === loan._id
            }
          >
            Lier
          </Button>
        </div>
      )}
    />
  </div>
);

export default PromotionLoanLinkerContainer(PromotionLoanLinker);
