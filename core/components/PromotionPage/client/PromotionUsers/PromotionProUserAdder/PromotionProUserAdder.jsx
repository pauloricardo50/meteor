// @flow
import React from 'react';

import { userSearch } from '../../../../../api/users/queries';
import { ROLES, USERS_COLLECTION } from '../../../../../api/constants';
import DialogSimple from '../../../../DialogSimple';
import Button from '../../../../Button';
import T from '../../../../Translation';
import CollectionSearch from '../../../../CollectionSearch';
import { CollectionIconLink } from '../../../../IconLink';
import PromotionProUserAdderContainer from './PromotionProUserAdderContainer';

type PromotionProUserAdderProps = {
  promotion: Object,
  addUser: Function,
};

const PromotionProUserAdder = ({
  addUser,
  promotion,
}: PromotionProUserAdderProps) => (
  <DialogSimple
    primary
    raised
    label={<T id="AdminPromotionPage.addUser.label" />}
    title={<T id="AdminPromotionPage.addUser.title" />}
    className="dialog-overflow"
  >
    <div className="flex-col">
      <CollectionSearch
        query={userSearch}
        queryParams={{ roles: [ROLES.PRO] }}
        title="Rechercher un compte Pro"
        renderItem={user => (
          <div className="user-search-item">
            <CollectionIconLink
              relatedDoc={{ ...user, collection: USERS_COLLECTION }}
            />
            <Button
              onClick={() => addUser({ userId: user._id })}
              primary
              disabled={
                promotion.users
                && promotion.users.map(({ _id }) => _id).includes(user._id)
              }
            >
              <T id="AdminPromotionPage.addUser" />
            </Button>
          </div>
        )}
      />
    </div>
  </DialogSimple>
);

export default PromotionProUserAdderContainer(PromotionProUserAdder);
