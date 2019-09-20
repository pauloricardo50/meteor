import { withProps } from 'recompose';
import { loanUpdatePromotionInvitedBy } from '../../../../api/methods';
import { getUserNameAndOrganisation } from '../../../../api/helpers';

const getMenuItems = ({
  promotionUsers = [],
  invitedBy,
  loanId,
  promotionId,
}) =>
  promotionUsers.map((user) => {
    const { _id } = user;
    const userName = getUserNameAndOrganisation({ user });
    return {
      id: _id,
      show: _id !== invitedBy,
      label: userName,
      link: false,
      onClick: () =>
        loanUpdatePromotionInvitedBy.run({
          loanId,
          promotionId,
          invitedBy: _id,
        }),
    };
  });

export default withProps(({ promotionUsers, invitedBy, loanId, promotionId }) => ({
  options: getMenuItems({ promotionUsers, invitedBy, loanId, promotionId }),
}));
