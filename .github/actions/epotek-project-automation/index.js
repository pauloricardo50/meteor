import settings from './settings';
import bugModule from './bugModule';
import pullRequestReviewModule from './pullRequestReviewModule';

const core = require('@actions/core');
const github = require('@actions/github');

const module = core.getInput('module');

const GITHUB_DATA = {
  issues: 'issue',
  pull_request: 'pull_request',
};

const filterModule = () => {
  if (!Object.keys(settings.modules).includes(module)) {
    throw new Error(`Unknown module ${module}`);
  }
};

const filterEvent = () => {
  const { eventName } = github.context;

  if (!settings.events.includes(eventName)) {
    throw new Error(`Unsupported event ${eventName}`);
  }
};

const getData = () => {
  filterEvent();

  const { eventName, payload } = github.context;
  const githubData = payload[GITHUB_DATA[eventName]];

  return {
    eventName,
    action: payload.action,
    githubData,
  };
};

const runModules = async () => {
  const data = getData();
  switch (module) {
    case 'bug':
      await bugModule({ settings, ...data });
      break;
    case 'pull_request_review':
      await pullRequestReviewModule({ settings, ...data });
      break;
    default:
      break;
  }
};

(async () => {
  try {
    filterModule();
    await runModules();
  } catch (error) {
    if (typeof error === 'string') {
      core.error(new Error(error));
    } else {
      core.error(error);
      core.setFailed(error.message);
    }
  }
})();
