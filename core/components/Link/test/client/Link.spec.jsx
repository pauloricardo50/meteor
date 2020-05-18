/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { createMemoryHistory } from 'history';

import {
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '../../../../utils/testHelpers/testing-library';
import Link from '../../Link';

// FIXME: find a clever way to test this component, helpful in other tests
// https://stackoverflow.com/questions/61869886/simplest-test-for-react-routers-link-with-testing-library-react
describe.skip('Link', () => {
  beforeEach(() => cleanup());

  it('routes to a new route', async () => {
    const history = createMemoryHistory();
    const { getByText } = render(<Link to="/hello">Click me</Link>, {
      getRouterProps: props => ({ ...props, history }),
    });

    fireEvent.click(getByText('Click me'));
    await waitFor(() => expect(history.location.pathname).to.equal('/hello'));
  });
});
