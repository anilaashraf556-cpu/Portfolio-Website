// =============================================================
// This script does ONE job: keep the top tab bar in sync with
// whichever section is currently visible on screen as you scroll.
// =============================================================

// Grab every tab button and every section on the page
const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".section, .hero");

// 1) Clicking a tab scrolls smoothly to its matching section
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetId = tab.dataset.target; // e.g. "about", "skills"
    const targetSection = document.getElementById(targetId);
    targetSection.scrollIntoView({ behavior: "smooth" });
  });
});

// 2) As the user scrolls, detect which section is in view and
//    highlight the matching tab automatically.
// IntersectionObserver watches elements and tells us when they
// enter or leave the visible part of the screen — we don't have
// to manually calculate scroll positions ourselves.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        // Remove "active" from every tab first
        tabs.forEach((tab) => tab.classList.remove("active"));

        // Add "active" only to the tab matching the visible section
        const matchingTab = document.querySelector(`.tab[data-target="${id}"]`);
        if (matchingTab) {
          matchingTab.classList.add("active");
        }
      }
    });
  },
  {
    // A section counts as "in view" once it's near the middle of the screen
    rootMargin: "-40% 0px -50% 0px",
  }
);

// Tell the observer to watch every section
sections.forEach((section) => observer.observe(section));
