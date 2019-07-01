// @flow
import React from 'react';
import Input from '@material-ui/core/Input';

import DialogSimple from 'core/components/DialogSimple';
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from 'core/components/List';
import Button from 'core/components/Button';
import { CollectionIconLink } from 'core/components/IconLink';
import { LOANS_COLLECTION } from 'core/api/constants';
import PromotionLoanLinkerContainer from './PromotionLoanLinkerContainer';

type PromotionLoanLinkerProps = {
  promotion: Object,
  searchQuery: String,
  onSearch: Function,
  setSearchQuery: Function,
  searchResults: Array<Object>,
  linkPromotionLoan: Function,
  unlinkPromotionLoan: Function,
  insertPromotionLoan: Function,
};

const PromotionLoanLinker = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  searchResults,
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
  >
    <div className="flex-col">
      <div className="flex-row center space-children">
        {promotion.promotionLoan && !!promotion.promotionLoan.length ? (
          <div className="flex-row center space-children">
            <p className="secondary center" style={{marginTop: 0}}>
              Dossier lié:&nbsp;
            </p>
            <CollectionIconLink
              relatedDoc={{
                ...promotion.promotionLoan[0],
                collection: LOANS_COLLECTION,
              }}
            />
            <Button
              onClick={() =>
                unlinkPromotionLoan({ loanId: promotion.promotionLoan[0]._id })
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
      <form onSubmit={onSearch}>
        <h4>Rechercher un dossier existant</h4>
        <Input
          type="text"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          placeholder="Rechercher..."
          style={{ width: '100%', marginBottom: '16px' }}
        />
      </form>
      <List className="flex-col loan-list">
        {searchResults
          && searchResults.map(loan => (
            <ListItem key={loan._id} className="loan">
              <ListItemText
                primary={(
                  <CollectionIconLink
                    relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
                  />
                )}
              />
              <ListItemSecondaryAction>
                <Button
                  onClick={() => linkPromotionLoan({ loanId: loan._id })}
                  primary
                  disabled={
                    promotion.promotionLoan && !!promotion.promotionLoan.length
                    && promotion.promotionLoan[0]._id === loan._id
                  }
                >
                  Lier
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
      {searchResults.length === 0 && <p>Aucun résultats</p>}
    </div>
  </DialogSimple>
);

export default PromotionLoanLinkerContainer(PromotionLoanLinker);
