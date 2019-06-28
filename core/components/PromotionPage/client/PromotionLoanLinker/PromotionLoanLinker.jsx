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
};

const PromotionLoanLinker = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  searchResults,
  linkPromotionLoan,
  promotion,
}: PromotionLoanLinkerProps) => (
  <DialogSimple
    primary
    raised
    label="Lier un dossier"
    title="Lier un dossier à la promotion"
  >
    <div className="flex-col">
      <div>
        Dossier lié:
        {' '}
        {promotion.promotionLoan ? (
          <CollectionIconLink
            relatedDoc={{
              ...promotion.promotionLoan,
              collection: LOANS_COLLECTION,
            }}
          />
        ) : 'Aucun'}
      </div>
      <form onSubmit={onSearch}>
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
              <ListItemText primary={loan.name} />
              <ListItemSecondaryAction>
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
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
      {searchResults.length === 0 && <p>Aucun résultats</p>}
    </div>
  </DialogSimple>
);

export default PromotionLoanLinkerContainer(PromotionLoanLinker);
