// @flow
import React from 'react';

import DialogSimple from 'core/components/DialogSimple';
import Button from 'core/components/Button';
import { CollectionIconLink } from 'core/components/IconLink';
import { LOANS_COLLECTION } from 'core/api/constants';
import CollectionSearch from 'core/components/CollectionSearch/CollectionSearch';
import { loanSearch } from 'core/api/loans/queries';
import PromotionLoanLinkerContainer from './PromotionLoanLinkerContainer';

type PromotionLoanLinkerProps = {
  promotion: Object,
  linkPromotionLoan: Function,
  unlinkPromotionLoan: Function,
  insertPromotionLoan: Function,
};

const PromotionLoanLinker = ({
  linkPromotionLoan,
  promotion,
  unlinkPromotionLoan,
  insertPromotionLoan,
}: PromotionLoanLinkerProps) => (
  <DialogSimple
    primary
    raised
    label="Lier un dossier"
    title="Lier un dossier à la promotion"
    className="dialog-overflow"
  >
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
              Aucun dossier lié. Vous pouvez lier un dossier existant en le
              recherchant ou en créer un nouveau.
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
          (promotion.promotionLoan
            ? loans.filter(loan => promotion.promotionLoan._id !== loan._id)
            : loans)
        }
        renderItem={loan => (
          <div
            className="flex-row"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <CollectionIconLink
              relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
            />
            <Button
              onClick={() => linkPromotionLoan({ loanId: loan._id })}
              primary
              disabled={
                promotion.promotionLoan
                && promotion.promotionLoan._id === loan._id
              }
            >
              Lier
            </Button>
          </div>
        )}
      />
    </div>
  </DialogSimple>
);

export default PromotionLoanLinkerContainer(PromotionLoanLinker);
