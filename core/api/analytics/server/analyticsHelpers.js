import ServerEventService from '../../events/server/ServerEventService';
import SessionService from '../../sessions/server/SessionService';
import Analytics from './Analytics';

export const impersonateMiddleware = context => () => next => (...args) => {
  const connection = context.connection || {};
  const { id: connectionId } = connection;
  const isImpersonate = SessionService.isImpersonatedSession(connectionId);

  // Don't track anything when impersonating
  if (isImpersonate) {
    return;
  }

  return next(...args);
};

export const addAnalyticsListener = ({
  method,
  func,
  analyticsProps = () => undefined,
}) => {
  ServerEventService.addAfterMethodListener(method, props => {
    props.context.unblock();
    const analytics = new Analytics(analyticsProps(props) || props.context);
    func({ ...props, analytics });
  });
};
