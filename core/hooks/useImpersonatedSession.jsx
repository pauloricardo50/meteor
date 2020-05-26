import { userImpersonatedSession } from '../api/sessions/queries';
import { useReactiveMeteorData } from './useMeteorData';

const useImpersonatedSession = () => {
  const { data: impersonatedSession, loading } = useReactiveMeteorData({
    query: userImpersonatedSession,
    params: () => {},
    type: 'single',
  });

  return { impersonatedSession, loading };
};

export default useImpersonatedSession;
