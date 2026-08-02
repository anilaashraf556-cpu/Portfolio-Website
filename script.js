// =============================================================
// This file is shared by all 4 pages (loaded via <script src="script.js">).
// Each part below only runs if the matching element actually exists
// on the current page — that's why we use "if (element)" checks.
// =============================================================

// ---- Dark mode toggle (present on every page) ----
// Same idea as your To-Do app: we save the choice in localStorage
// so it's remembered even after closing the browser.
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  // On page load, check if dark mode was saved from a previous visit
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️"; // show a sun icon when already in dark mode
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    // Save the choice for next time
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Swap the icon: moon = "click to go dark", sun = "click to go light"
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });
}

// ---- Contact form validation (Contact page only) ----
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const messageInput = document.getElementById("messageInput");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault(); // stop the page from reloading on submit

    // Reset old error messages before checking again
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    formStatus.textContent = "";

    let isValid = true;

    // Name must not be empty
    if (nameInput.value.trim() === "") {
      nameError.textContent = "Please enter your name.";
      isValid = false;
    }

    // Very simple email pattern check: something@something.something
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // Message must not be empty
    if (messageInput.value.trim() === "") {
      messageError.textContent = "Please write a short message.";
      isValid = false;
    }

    if (isValid) {
      // NOTE: This form does not actually send data anywhere yet —
      // there's no backend connected. In a later step, we can connect
      // it to a free service (like Formspree) so real messages arrive
      // in your inbox. For now, this just confirms the form works.
      formStatus.textContent = "Message looks good! (Not yet connected to email — coming in a later step.)";
      contactForm.reset();
    }
  });
}
