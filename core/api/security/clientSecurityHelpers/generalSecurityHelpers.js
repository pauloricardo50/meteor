import SecurityService from '../Security';

export const hasMinimumRole = ({ role, userId }) => {
  try {
    SecurityService.minimumRole(role)(userId);
    return true;
  } catch (error) {
    return false;
  }
};
