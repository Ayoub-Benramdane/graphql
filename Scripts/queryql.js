export const user_info = `
{
  user {
    firstName
    lastName
  }
}`

export const ratio_info = `
{
  user {
    auditRatio
  }
}`

export const level_info = `
{
  transaction(
    where: {_and: [{type: {_eq: "level"}}, {event: {object: {name: {_eq: "Module"}}}}]}
    order_by: {amount: desc}
    limit: 1
  ) {
    amount
  }
}`

export const skills_info = `
{
  user {
    skillTechnologies: transactions(where: {type: {_in: ["skill_go", "skill_docker", "skill_js", "skill_html", "skill_css", "skill_sql", "skill_unix"]}}) {
      type
      amount
    }
    skillTechnical: transactions(where: {_and: [{type: {_like: "skill%"}}, {type: {_nin: ["skill_go", "skill_docker", "skill_js", "skill_html", "skill_css", "skill_sql", "skill_unix"]}}]}) {
      type
      amount
    }
  }
}`


export const top_project = `
{
  user {
    transactions(
    limit: 5
    where: {_and: [{type: {_eq: "xp"}}, {object: {name: {_nlike: "Piscine JS"}}}, {event: {object: {name: {_eq: "Module"}}}}]}
    order_by: {amount: desc}) {
      object {
        name
      }
      amount
      createdAt
    }
  }
}`

export const transaction_info = `
{
  transaction(
    where: {
      _and: [
        { type: { _eq: "xp" } },
        { event: { object: { name: { _eq: "Module" } } } },
        { amount: {_gt: 4000}},
      ]
    },
    order_by: {createdAt: asc}
  ) {
    amount
    object {
      name
    }
    createdAt
  }
}`