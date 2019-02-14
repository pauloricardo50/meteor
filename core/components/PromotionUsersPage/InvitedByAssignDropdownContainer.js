import { withProps } from 'recompose';
import { loanUpdatePromotionInvitedBy } from '../../api';

const getMenuItems = ({
  promotionUsers = [],
  invitedBy,
  loanId,
  promotionId,
}) =>
  promotionUsers.map((user) => {
    const { _id, name } = user;
    return {
      id: _id,
      show: _id !== invitedBy,
      label: name,
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
