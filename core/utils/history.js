import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

// used in end to end testing
window.reactRouterDomHistory = history;

export default history;