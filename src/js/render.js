import { services, skills } from "./data.js";

// Render services dynamically
const servicesContainer = document.querySelector(".services-grid");
servicesContainer.innerHTML = services.map(service => `
  <div class="service-card">
    <div class="service-icon">
      <i class="${service.icon}"></i>
    </div>
    <h3 class="service-title">${service.title}</h3>
    <p class="service-description">${service.description}</p>
  </div>
`).join("");

// Render skills dynamically
const skillsGrid = document.querySelector(".skills-grid");
skillsGrid.innerHTML = skills.map(skill => `
  <div class="skill-item">${skill}</div>
`).join("");