const settings = {
  events: ['issues', 'pull_request'],
  modules: {
    bug: {
      project: 'Bugs',
      column: 'Triage',
      triggerLabels: ['bug', 'Bug', 'type: Bug'],
    },
    pull_request_review: {
      column: 'Review',
    },
  },
};

export default settings;
