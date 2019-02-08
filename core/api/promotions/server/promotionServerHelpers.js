import { shouldAnonymize } from 'imports/core/api/promotions/helpers';
import UserService from '../../users/server/UserService';
import { proUser } from '../../fragments';

const ANONYMIZED_STRING = 'XXX';
const ANONYMIZED_USER = {
  name: ANONYMIZED_STRING,
  phoneNumbers: [ANONYMIZED_STRING],
  email: ANONYMIZED_STRING,
};

export const handleLoansAnonymization = ({
  loans = [],
  userId,
  promotionId,
}) => {
  const currentUser = UserService.fetchOne({
    $filters: { _id: userId },
    ...proUser(),
  });

  return loans.map((loan) => {
    const { user, ...rest } = loan;
    const { promotions = [] } = loan;
    const {
      $metadata: { invitedBy },
    } = promotions.find(({ _id }) => _id === promotionId);

    return {
      user: shouldAnonymize({ currentUser, promotionId, invitedBy })
        ? ANONYMIZED_USER
        : user,
      ...rest,
    };
  });
};
