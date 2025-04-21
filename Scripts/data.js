import { fetchGraphQL } from "./graphql.js";
import { top_project } from "./queryql.js";
import { renderAuditsInfo } from "./ratio.js";
import { renderLevelInfo } from "./level.js";
import { renderSkillsInfo } from "./skills.js";
import { renderProjectsInfo } from "./projects.js";
import { renderTransactionInfo } from "./transaction.js";

export async function checkUserData() {
  const token = localStorage.getItem("JWT");
  let Fetch = await fetchGraphQL(top_project, token);

  if (Fetch.data.user[0].transactions.length === 0) {
    renderNoData();
    return;
  }
  renderAuditsInfo();
  renderLevelInfo();
  renderProjectsInfo();
  renderSkillsInfo();
  renderTransactionInfo();
}

function renderNoData() {
  let container = document.querySelector(".profile-container");
  container.innerHTML = `
    <div class="no-data-container">
      <h2 class="no-data-title">No Data Available</h2>
      <p class="no-data-message">
        You have not completed any projects yet. Start by completing your first project to see your progress.
      </p>
    </div>
  `;
}
