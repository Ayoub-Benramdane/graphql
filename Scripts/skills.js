import { fetchGraphQL } from "./graphql.js";
import { skills_info } from "./queryql.js";

export async function renderSkillsInfo() {
  const token = localStorage.getItem("JWT");

  await fetchGraphQL(skills_info, token)
    .then((response) => {
      if (Array.isArray(response.errors)) {
        throw response.errors[0].message;
      }
      const skillTechnologies = response?.data.user[0].skillTechnologies;
      const skillTechnical = response?.data.user[0].skillTechnical;
      if (response && Array.isArray(skillTechnologies)) {
        const maxAmountsTechnologies = skillTechnologies.reduce(
          (acc, skillTechnologies) => {
            const { type, amount } = skillTechnologies;
            if (!acc[type]) {
              acc[type] = amount;
            } else {
              acc[type] = Math.max(acc[type], amount);
            }

            return acc;
          },
          {}
        );
        const maxAmountsTechnical = skillTechnical.reduce(
          (acc, skillTechnical) => {
            const { type, amount } = skillTechnical;
            if (!acc[type]) {
              acc[type] = amount;
            } else {
              acc[type] = Math.max(acc[type], amount);
            }

            return acc;
          },
          {}
        );
        const svgTechnologies = document.getElementById("skills-technologies");
        const svgTechnical = document.getElementById("skills-technical");
        if (svgTechnologies == null || svgTechnical == null) {
          return
        }
        renderSkillsTemplate(maxAmountsTechnologies, svgTechnologies);
        renderSkillsTemplate(maxAmountsTechnical, svgTechnical);
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

function renderSkillsTemplate(skills, svg) {  
  svg.innerHTML = "";
  const width = 400, height = 400;
  const centerX = width / 2, centerY = height / 2;
  const maxRadius = 130;
  
  for (let i = 1; i <= 10; i++) {
    const radius = (i / 10) * maxRadius;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", centerX);
    circle.setAttribute("cy", centerY);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "gray");
    circle.setAttribute("stroke-width", "0.5");
    svg.appendChild(circle);
  }

  const skillNames = Object.keys(skills);
  const skillValues = Object.values(skills);
  const totalSkills = skillNames.length;
  const angleStep = (2 * Math.PI) / totalSkills;  
  let points = "";

  skillNames.forEach((skill, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + maxRadius * Math.cos(angle);
    const y = centerY + maxRadius * Math.sin(angle);

    const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisLine.setAttribute("x1", centerX);
    axisLine.setAttribute("y1", centerY);
    axisLine.setAttribute("x2", x);
    axisLine.setAttribute("y2", y);
    axisLine.setAttribute("stroke", "gray");
    axisLine.setAttribute("stroke-width", "0.8");
    svg.appendChild(axisLine);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "14");
    text.setAttribute("fill", "white");
    text.textContent = skill.split('_')[1];
    svg.appendChild(text);

    const valueRadius = (skillValues[i] / 100) * maxRadius;
    const valueX = centerX + valueRadius * Math.cos(angle);
    const valueY = centerY + valueRadius * Math.sin(angle);
    points += `${valueX},${valueY} `;
  });
  
  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("points", points);
  polygon.setAttribute("fill", "rgba(180, 150, 255, 0.5)");
  polygon.setAttribute("stroke", "#c4aaf6");
  polygon.setAttribute("stroke-width", "2");
  svg.appendChild(polygon);
}