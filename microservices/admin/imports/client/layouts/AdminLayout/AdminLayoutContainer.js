// @flow
import { compose } from 'recompose';
import { withHotKeys } from 'react-hotkeys';
import query from 'core/api/users/queries/currentUser';
import { withSmartQuery } from 'core/api/containerToolkit';

export default compose(
  // withHotKeys(
  //   { search: 'down' },
  //   {
  //     focused: true,
  //     attach: window,
  //     handlers: { up: () => console.log('yo') },
  //   },
  // ),
  withSmartQuery({
    query,
    params: () => ({}),
    queryOptions: { reactive: true, single: true },
    dataName: 'currentUser',
    renderMissingDoc: false,
  }),
);
