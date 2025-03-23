import { fetchGraphQL } from "./graphql.js";
import { transaction_info } from "./queryql.js";

export async function renderTransactionInfo() {
    const token = localStorage.getItem("JWT");
    await fetchGraphQL(transaction_info, {}, token)
        .then((response) => {
            if (Array.isArray(response.errors)) {
                throw response.errors[0].message;
            }
            const projects = response?.data.transaction;
            if (!response && typeof projects !== "object") {
                throw new Error("Invalid projects received!");
            }
            renderTransactionTemplate(projects);
        })
        .catch((error) => {
            if (typeof error === "string" && error.includes("JWTExpired"))
                handleLogout();
            console.error(error);
        });
}

function renderTransactionTemplate(projects) {
    const svg = document.getElementById("transaction-info");
    svg.innerHTML = "";

    const width = svg.clientWidth - 100;
    const height = svg.clientHeight - 50;
    const padding = 20;
    let lastXp = 0;
    let totalXp = 0;

    projects.forEach((project) => {
        totalXp += project.amount;
    });

    const numTicks = 5;
    for (let i = 0; i <= numTicks; i++) {
        const yValue = (i / numTicks) * totalXp;
        const yPos = height - padding - (yValue / totalXp) * (height - 2 * padding);

        const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        gridLine.setAttribute("x1", padding);
        gridLine.setAttribute("y1", yPos);
        gridLine.setAttribute("x2", width + 5 * padding);
        gridLine.setAttribute("y2", yPos);
        gridLine.setAttribute("stroke", "#ddd");
        gridLine.setAttribute("stroke-width", 1);
        gridLine.setAttribute("stroke-dasharray", "4,4");
        svg.appendChild(gridLine);

        const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        yLabel.setAttribute("x", padding + 30);
        yLabel.setAttribute("y", yPos);
        yLabel.setAttribute("text-anchor", "end");
        yLabel.setAttribute("font-size", "12");
        yLabel.setAttribute("fill", "white");
        yLabel.textContent = `${(yValue / 1000).toFixed(1)} KB`;
        svg.appendChild(yLabel);
    }

    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    let points = "";

    projects.forEach((project, i) => {
        const cx = padding + (i + 1) * (width / projects.length);
        const cy = height - padding - ((project.amount + lastXp) / totalXp) * (height - 2 * padding);
        lastXp += project.amount;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", 5);
        circle.setAttribute("fill", "#c1a6f0");

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", cx);
        text.setAttribute("y", cy - 30);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "14");
        text.setAttribute("fill", "white");
        text.setAttribute("visibility", "hidden");


        const tspan1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan1.textContent = project.object.name;
        text.appendChild(tspan1);

        const tspan2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan2.textContent = `${(project.amount / 1000).toFixed(1)}KB`;
        tspan2.setAttribute("x", cx);
        tspan2.setAttribute("dy", "15");
        text.appendChild(tspan2);

        const tspan3 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan3.textContent = `Total XP: ${(lastXp / 1000).toFixed(1)}KB`;
        tspan3.setAttribute("x", cx);
        tspan3.setAttribute("dy", "-30");
        text.appendChild(tspan3);

        circle.addEventListener("mouseover", () => {
            circle.setAttribute("r", 10);
            text.setAttribute("visibility", "visible");
        });

        circle.addEventListener("mouseout", () => {
            circle.setAttribute("r", 5);
            text.setAttribute("visibility", "hidden");
        });

        svg.appendChild(circle);
        svg.appendChild(text);

        points += `${cx},${cy} `;
    });

    polyline.setAttribute("points", points);
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "#c4aaf6");
    polyline.setAttribute("stroke-width", 2);

    svg.appendChild(polyline);
}