export async function fetchGraphQL(query, variables, token) {
    const response = await fetch(`https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
        }),
    });
    return response.json();
};
