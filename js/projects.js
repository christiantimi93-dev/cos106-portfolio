/* =========================================================
   projects.js - filter project cards by status
   ========================================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectCount = document.getElementById("project-count");

function filterProjects(filter) {
  let shown = 0;
  projectCards.forEach(function (card) {
    const match = filter === "all" || card.dataset.status === filter;
    card.classList.toggle("hidden", !match);
    if (match) shown++;
  });
  projectCount.textContent = "Showing " + shown + (shown === 1 ? " project" : " projects");
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (b) {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    filterProjects(button.dataset.filter);
  });
});

// "Demo soon" links should not jump to the top of the page
document.querySelectorAll(".is-disabled").forEach(function (link) {
  link.addEventListener("click", function (event) { event.preventDefault(); });
});
