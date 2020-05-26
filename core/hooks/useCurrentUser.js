import { useContext } from 'react';

import CurrentUserContext from '../containers/CurrentUserContext';

const useCurrentUser = () => useContext(CurrentUserContext);

export default useCurrentUser;
