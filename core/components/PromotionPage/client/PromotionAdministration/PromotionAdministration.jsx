//      
import React, { useContext } from 'react';

import { CurrentUserContext } from '../../../../containers/CurrentUserContext';
import { addProUserToPromotion } from '../../../../api/methods';
import {
  PROMOTIONS_COLLECTION,
  ROLES,
  USERS_COLLECTION,
} from '../../../../api/constants';
import { userSearch } from '../../../../api/users/queries';
import CollectionSearch from '../../../CollectionSearch';
import CollectionIconLink from '../../../IconLink/CollectionIconLink';
import Button from '../../../Button';
import DropdownMenu from '../../../DropdownMenu';
import Icon from '../../../Icon';
import T from '../../../Translation';
import UploaderArray from '../../../UploaderArray';
import Dialog from '../../../Material/Dialog';
import PromotionAdministrationContainer from './PromotionAdministrationContainer';
import PromotionLoanLinker from '../PromotionLoanLinker';

                                       

const PromotionAdministration = ({
  promotion,
  options,
  promotionDocuments,
  openDocumentsModal,
  setOpenDocumentsModal,
  openProInvitationModal,
  setOpenProInvitationModal,
  openLinkLoanModal,
  setOpenLinkLoanModal,
}                              ) => {
  const currentUser = useContext(CurrentUserContext);

  const { _id: promotionId } = promotion;

  if (options.length === 0) {
    return null;
  }

  const dialogActions = setOpenModal => [
    <Button primary onClick={() => setOpenModal(false)} key="close">
      <T id="general.close" />
    </Button>,
  ];

  return (
    <>
      {/* The following 2 modals need to receive reactive data, and can not be used with the ModalManager */}
      <Dialog
        title={<T id="PromotionAdministration.manageDocuments" />}
        open={openDocumentsModal}
        onClose={() => setOpenDocumentsModal(false)}
        actions={dialogActions(setOpenDocumentsModal)}
      >
        <UploaderArray
          doc={promotion}
          collection={PROMOTIONS_COLLECTION}
          documentArray={promotionDocuments}
          currentUser={currentUser}
          allowRequireByAdmin={false}
        />
      </Dialog>

      <Dialog
        title={<T id="PromotionAdministration.addUser" />}
        open={openProInvitationModal}
        onClose={() => setOpenProInvitationModal(false)}
        actions={dialogActions(setOpenProInvitationModal)}
      >
        <div className="flex-col">
          <CollectionSearch
            query={userSearch}
            queryParams={{ roles: [ROLES.PRO] }}
            title="Rechercher un utilisateur PRO"
            renderItem={user => (
              <div className="user-search-item">
                <CollectionIconLink
                  relatedDoc={{ ...user, collection: USERS_COLLECTION }}
                  placement="left"
                />
                <Button
                  onClick={() =>
                    addProUserToPromotion.run({
                      promotionId,
                      userId: user._id,
                    })
                  }
                  primary
                  disabled={
                    promotion.users &&
                    promotion.users.map(({ _id }) => _id).includes(user._id)
                  }
                >
                  <T id="AdminPromotionPage.addUser" />
                </Button>
              </div>
            )}
          />
        </div>
      </Dialog>

      <DropdownMenu
        button
        buttonProps={{
          label: <T id="PromotionAdministration.buttonLabel" />,
          raised: true,
          primary: true,
          icon: <Icon type="settings" />,
        }}
        options={options}
        noWrapper
        menuProps={{
          anchorOrigin: { vertical: 'bottom', horizontal: 'start' },
          transformOrigin: { vertical: 'top', horizontal: 'start' },
        }}
      />
      <Dialog
        title={<T id="PromotionAdministration.linkLoan" />}
        open={openLinkLoanModal}
        onClose={() => setOpenLinkLoanModal(false)}
        actions={dialogActions(setOpenLinkLoanModal)}
      >
        <PromotionLoanLinker promotion={promotion} />
      </Dialog>
    </>
  );
};

export default PromotionAdministrationContainer(PromotionAdministration);
