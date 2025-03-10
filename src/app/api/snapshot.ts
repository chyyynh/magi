export async function fetchProposal(proposalId: string) {
  const response = await fetch("https://hub.snapshot.org/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetProposal($id: String!) {
          proposal(id: $id) {
            id
            title
            body
            choices
            start
            end
            state
            author
            space {
              id
              name
            }
            scores_total
            scores
            votes
          }
        }
      `,
      variables: {
        id: proposalId,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log(result.title);
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  return result.data.proposal || {};
}
