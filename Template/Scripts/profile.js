import { fetchGraphQL } from "./graphql.js";
import { handleLogout } from "./login.js";
import { user_info } from "./queryql.js";
import { renderAuditsInfo } from "./ratio.js";
import { renderLevelInfo } from "./level.js";
import { renderSkillsInfo } from "./skills.js";
import { renderProjectsInfo } from "./projects.js";
import { renderTransactionInfo } from "./tansaction.js";

export async function handleProfile() {
    const token = localStorage.getItem("JWT");
    fetchGraphQL(user_info, {}, token)
        .then((response) => {
            if (Array.isArray(response.errors)) {
                throw response.errors[0].message;
            }
            const user = response?.data.user;
            
            if (response && Array.isArray(user)) {
                renderProfilePage(user[0]);
            } else {
                throw new Error("Invalid data received!");
            }
        })
        .catch((error) => {
            if (typeof error === "string" && error.includes("JWTExpired"))
                handleLogout();
            console.error(error);
        });
}

function renderProfilePage(user) {
    document.body.innerHTML = ``;
    const container = document.createElement('div');
    container.className = "main-container";
    container.innerHTML = `
    <div class="profile">
        <div class="profile-header">
            <div class="user-info">
                <h1>Welcome, <span class="user-name">${user.firstName} ${user.lastName}</span>!</h1>
            </div>
            <button id="logout-button" class="btn logout-btn">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
        </div>
        <div class="profile-container">
            <div id="audits-ratio"></div>
            <div id="level-info"></div>
            <div id="projects-info"></div>
            <div id="skills-info">
            <div class="skills-container">
            <svg id="skills-technologies"></svg>
            <h2 class="skills-title">Your Technology Skills</h2>
            </div>
            <div class="skills-container">
            <svg id="skills-technical"></svg>
            <h2 class="skills-title">Your Technical Skills</h2>
            </div>
            </div>
            <svg id="transaction-info"></svg>
        </div>
    </div>`;

    document.body.appendChild(container);
    document.getElementById('logout-button')?.addEventListener('click', handleLogout);
    renderAuditsInfo();
    renderLevelInfo();
    renderProjectsInfo();
    renderSkillsInfo();
    renderTransactionInfo();
};