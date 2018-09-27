import { lifecycle } from 'recompose';

import SlackService from '../api/slack';

const withErrorCatcher = lifecycle({
  componentDidMount() {
    if (!window) {
      return;
    }

    window.onerror = (msg, url, lineNo, columnNo, error) => {
      const { Kadira } = window;
      if (Kadira && Kadira.trackError) {
        Kadira.trackError('react', error.stack.toString());
      }
      SlackService.sendError(error);
    };
  },
});

export default withErrorCatcher;
