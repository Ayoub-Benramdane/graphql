import { fetchGraphQL } from "./graphql.js";
import { top_project } from "./queryql.js";

export function renderProjectsInfo() {
    const token = localStorage.getItem("JWT");
    fetchGraphQL(top_project, {}, token)
        .then((response) => {
            if (Array.isArray(response.errors)) {
                throw response.errors[0].message;
            }
            if (response && Array.isArray(response.data.user[0].transactions)) {
                const projects = response.data.user[0].transactions
                renderProjectsTemplate(projects);
            } else {
                throw new Error("Invalid data received!");
            }
        })
}

function renderProjectsTemplate(projects) {
    const container = document.getElementById("projects-info");
    container.innerHTML = `
    <div class="projects-container">
    <h2>Top projects</h2>
        ${projects
            .map(
                (project) => `
            <div class="project-card">
                <h4>${project.object.name}</h4>
                <span>${(project.amount / 1000).toFixed(1)} KB</span>
            </div>`).join('')}
    </div>`;
}