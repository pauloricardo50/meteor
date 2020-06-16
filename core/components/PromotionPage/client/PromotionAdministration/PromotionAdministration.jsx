import React from 'react';

import { addProUserToPromotion } from '../../../../api/promotions/methodDefinitions';
import { userSearch } from '../../../../api/users/queries';
import { ROLES } from '../../../../api/users/userConstants';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import Button from '../../../Button';
import CollectionSearch from '../../../CollectionSearch';
import DropdownMenu from '../../../DropdownMenu';
import Icon from '../../../Icon';
import CollectionIconLink from '../../../IconLink/CollectionIconLink';
import Dialog from '../../../Material/Dialog';
import T from '../../../Translation';
import UploaderArray from '../../../UploaderArray';
import PromotionLoanLinker from '../PromotionLoanLinker';
import PromotionAdministrationContainer from './PromotionAdministrationContainer';
import PromotionLotGroupsManager from './PromotionLotGroupsManager';

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
  permissions = {},
  openPromotionLotGroupsModal,
  setOpenPromotionLotGroupsModal,
}) => {
  const currentUser = useCurrentUser();
  const { canManageDocuments } = permissions;

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
          documentArray={promotionDocuments}
          currentUser={currentUser}
          allowRequireByAdmin={false}
          allowSetRoles={canManageDocuments}
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
            title="Rechercher un compte Pro"
            renderItem={user => (
              <div className="user-search-item">
                <CollectionIconLink relatedDoc={user} placement="left" />
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

      <Dialog
        title={<T id="PromotionAdministration.managePromotionLotGroups" />}
        open={openPromotionLotGroupsModal}
        onClose={() => setOpenPromotionLotGroupsModal(false)}
        actions={dialogActions(setOpenPromotionLotGroupsModal)}
      >
        <PromotionLotGroupsManager promotion={promotion} />
      </Dialog>
    </>
  );
};

export default PromotionAdministrationContainer(PromotionAdministration);
