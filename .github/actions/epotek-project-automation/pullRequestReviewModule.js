const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('repo-token');

const octokit = new github.GitHub(token);

const pullRequestReviewModule = async ({ settings, githubData }) => {
  const { html_url: url } = githubData;
  const { column } = settings.modules.pull_request_review;

  const query = `query {
        resource(url: "${url}")
        {
            ... on PullRequest 
            {
                body
                projectCards
                { 
                    nodes
                    {
                        id
                        project {
                            name
                            id
                            url
                            columns(first:4) {
                                nodes {
                                    id
                                    name
                                    cards {
                                        nodes {
                                            id
                                            content {
                                                ... on Issue {                                                
                                                        url
                                                        title
                                                }
                                            }
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
  const { body } = resource;
  const regex = body.match(/close[d|s] #(\d*)/m);
  const issueNumber = regex.length > 1 && regex[1];

  if (issueNumber) {
    const {
      projectCards: { nodes },
    } = resource;
    const [
      {
        project: {
          name: projectName,
          columns: { nodes: projectColumns },
        },
      },
    ] = nodes;
    let issue;
    let columnId;
    projectColumns.forEach(({ name, id, cards: { nodes: columnCards } }) => {
      if (name === column) {
        columnId = id;
      }
      issue =
        issue ||
        columnCards.find(
          ({ content: { url: issueUrl = '' } }) =>
            issueUrl.split('/').slice(-1)[0] === issueNumber,
        );
    });
    const cardId = issue && issue.id;
    const issueTitle = issue && issue.content && issue.content.title;

    if (cardId) {
      await octokit.graphql(`mutation {
                moveProjectCard(input: {cardId:"${cardId}", columnId: "${columnId}"}) {clientMutationId}
            }`);
      console.log(`✅ Moved card ${issueTitle} to ${column} in ${projectName}`);
    }
  }
};

export default pullRequestReviewModule;
