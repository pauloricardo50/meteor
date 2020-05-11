import React from 'react';

import { userSearch } from '../../../../../api/users/queries';
import { ROLES } from '../../../../../api/users/userConstants';
import Button from '../../../../Button';
import CollectionSearch from '../../../../CollectionSearch';
import DialogSimple from '../../../../DialogSimple';
import { CollectionIconLink } from '../../../../IconLink';
import T from '../../../../Translation';
import PromotionProUserAdderContainer from './PromotionProUserAdderContainer';

const PromotionProUserAdder = ({ addUser, promotion }) => (
  <DialogSimple
    primary
    raised
    label={<T id="PromotionPage.addUser.label" />}
    title={<T id="PromotionPage.addUser.title" />}
    className="dialog-overflow"
  >
    <div className="flex-col">
      <CollectionSearch
        query={userSearch}
        queryParams={{ roles: [ROLES.PRO] }}
        title="Rechercher un compte Pro"
        renderItem={user => (
          <div className="user-search-item">
            <CollectionIconLink placement="left" relatedDoc={user} />
            <Button
              onClick={() => addUser({ userId: user._id })}
              primary
              disabled={
                promotion.users &&
                promotion.users.map(({ _id }) => _id).includes(user._id)
              }
            >
              <T id="PromotionPage.addUser" />
            </Button>
          </div>
        )}
      />
    </div>
  </DialogSimple>
);

export default PromotionProUserAdderContainer(PromotionProUserAdder);
