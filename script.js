// =============================================================
// Shared JavaScript for all 4 pages
// =============================================================

// ---- Dark mode toggle (present on every page) ----

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  // Check if dark mode was saved from a previous visit
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");
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

  // Validate the contact form
  function validateContactForm() {
    // Clear old error messages
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";

    let isValid = true;

    // -------------------------
    // Name validation
    // -------------------------

    const nameValue = nameInput.value.trim();

    // Allows letters, spaces, apostrophes, and hyphens
    const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

    if (nameValue === "") {
      nameError.textContent = "Please enter your name.";
      isValid = false;
    } else if (!namePattern.test(nameValue)) {
      nameError.textContent =
        "Name can only contain letters, spaces, apostrophes, and hyphens.";
      isValid = false;
    }

    // -------------------------
    // Email validation
    // -------------------------

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // -------------------------
    // Message validation
    // -------------------------

    if (messageInput.value.trim() === "") {
      messageError.textContent = "Please write a short message.";
      isValid = false;
    }

    return isValid;
  }

  // ---- Handle form submission ----

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formStatus.textContent = "";

    // Stop if validation fails
    if (!validateContactForm()) {
      return;
    }

    // Validation passed — send the form to Formspree
    const submitBtn = contactForm.querySelector(
      "button[type='submit']"
    );

    submitBtn.disabled = true;
    formStatus.textContent = "Sending...";

    fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          formStatus.textContent =
            "Thanks! Your message has been sent — I'll get back to you soon.";

          contactForm.reset();
        } else {
          formStatus.textContent =
            "Something went wrong. Please try again or email me directly.";
        }
      })
      .catch(() => {
        formStatus.textContent =
          "Something went wrong. Please try again or email me directly.";
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
}