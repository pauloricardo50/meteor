const settings = {
  events: ['issues', 'pull_request'],
  modules: {
    bug: {
      project: 'Bugs',
      column: 'Triage',
      triggerLabels: ['bug', 'Bug'],
    },
  },
};

export default settings;
