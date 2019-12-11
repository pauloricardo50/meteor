const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('repo-token');

const octokit = new github.GitHub(token);

const bugModule = async ({ settings, action, githubData }) => {
  const { node_id: nodeId, html_url: url, labels = [] } = githubData;
  const { project, column, triggerLabels } = settings.modules.bug;

  // Filter triggered labels
  if (!labels.length) {
    throw 'Only labeled issues are allowed';
  }

  if (!labels.some(({ name }) => triggerLabels.some(label => label === name))) {
    throw `Only issues labeled [${triggerLabels
      .map(label => `"${label}"`)
      .join(', ')}] allowed`;
  }

  // Get the column ID  from searching for the project and card Id if it exists
  const query = `query {
			resource( url: "${url}" ) {
				... on Issue {
					projectCards {
						nodes {
							id
						}
					}
					repository {
						projects( search: "${project}", first: 10, states: [OPEN] ) {
							nodes {
								id
								columns( first: 100 ) {
									nodes {
										id
										name
									}
								}
							}
						}
						owner {
							... on ProjectOwner {
								projects( search: "${project}", first: 10, states: [OPEN] ) {
									nodes {
										id
										columns( first: 100 ) {
											nodes {
												id
												name
											}
										}
									}
								}
							}
						}
					}
				}
			}
        }`;

  const { resource } = await octokit.graphql(query);

  // All the matching projects found
  const repoProjects = resource.repository.projects.nodes || [];
  const orgProjects =
    (resource.repository.owner &&
      resource.repository.owner.projects &&
      resource.repository.owner.projects.nodes) ||
    [];

  // Search the projects for columns with a name that matches
  const columns = [...repoProjects, ...orgProjects].flatMap(projects =>
    projects.columns.nodes
      ? projects.columns.nodes.filter(
          projectColumn => projectColumn.name === column,
        )
      : [],
  );

  const cardId =
    (resource.projectCards.nodes &&
      resource.projectCards.nodes[0] &&
      resource.projectCards.nodes[0].id) ||
    null;

  if (columns.length === 0) {
    throw new Error(`Could not find ${column} in ${project}`);
  }

  // If a card already exists, move it to the column
  if (cardId) {
    await Promise.all(
      columns.map(col =>
        octokit.graphql(`mutation {
					moveProjectCard( input: { cardId: "${cardId}", columnId: "${col.id}"
				}) { clientMutationId } }`),
      ),
    );
    // If the card does not exist, add it to the column
  } else {
    await Promise.all(
      columns.map(col =>
        octokit.graphql(`mutation {
					addProjectCard( input: { contentId: "${nodeId}", projectColumnId: "${col.id}"
				}) { clientMutationId } }`),
      ),
    );
  }

  console.log(
    `✅ ${
      action === 'opened' ? 'Added' : 'Moved'
    } card to ${column} in ${project}`,
  );
};

export default bugModule;
