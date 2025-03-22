import { fetchGraphQL } from "./graphql.js";
import { ratio_info } from "./queryql.js";

export async function renderAuditsInfo() {
    const token = localStorage.getItem("JWT");
    await fetchGraphQL(ratio_info, {}, token)
        .then((response) => {
            if (Array.isArray(response.errors)) {
                throw response.errors[0].message;
            }
            const data = response?.data.user[0];
            if (!response && typeof data !== "object") {
                throw new Error("Invalid data received!");
            }
            renderAuditsTemplate(data);
        })
        .catch((error) => {
            if (typeof error === "string" && error.includes("JWTExpired"))
                handleLogout();
            console.error(error);
        });
}

function renderAuditsTemplate(data) {
    const container = document.getElementById("audits-ratio");
    container.innerHTML = `
    <div class="audits-container">
        <h2 class="level-title">Your Audit Ratio</h2>
        <div class="level-card">
            <span class="level-number">${data.auditRatio.toFixed(1)}</span>
        </div>
    </div>
`;
}
