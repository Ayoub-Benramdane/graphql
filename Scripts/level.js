import { fetchGraphQL } from "./graphql.js";
import { level_info } from "./queryql.js";

export async function renderLevelInfo() {
  const token = localStorage.getItem("JWT");
  await fetchGraphQL(level_info, token)
    .then((response) => {
      if (Array.isArray(response.errors)) {
        throw response.errors[0].message;
      }

      if (response && Array.isArray(response.data.transaction)) {
        if (response.data.transaction.length === 0) {
          throw new Error("No transaction found!");
        }
        const level = response.data.transaction[0].amount;
        renderLevelTemplate(level);
      } else {
        throw new Error("Invalid data received!");
      }
    })
    .catch((error) => {
      if (typeof error === "string" && error.includes("JWTExpired"))
      console.error(error);
    });
}

function renderLevelTemplate(level) {
  const rank = getRank(level);
  const container = document.getElementById("level-info");
  container.innerHTML = `
    <div class="rank-container">
      <h2 class="level-title">Your Current Rank</h2>
      <h3 class="level-title">${rank}</h3>
    </div>
    <div class="level-container">
      <h2 class="level-title">Your Current Level</h2>
      <div class="level-card">
          <span class="level-number">${level}</span>
      </div>
    </div>
`;
}

function getRank(level) {
  if (level < 10) {
    return "Aspiring developer";
  } else if (level < 20) {
    return "Beginner developer";
  } else if (level < 30) {
    return "Apprentice developer";
  } else if (level < 40) {
    return "Assistant developer";
  } else if (level < 50) {
    return "Basic developer";
  } else if (level < 55) {
    return "Junior developer";
  } else if (level < 60) {
    return "Confirmed developer";
  } else {
    return "Expert";
  }
}