import { branch, renderComponent } from 'recompose';

import AnonymousAppPage from './AnonymousAppPage';

export default branch(
  ({ currentUser }) => !currentUser,
  renderComponent(AnonymousAppPage),
);
