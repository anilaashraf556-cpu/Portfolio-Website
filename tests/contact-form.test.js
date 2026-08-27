import { describe, it, expect } from "vitest";

describe("Contact form validation", () => {

  // TEST 1
  it("shows errors when the form is submitted empty", () => {
    document.body.innerHTML = `
      <form id="contactForm">
        <label for="nameInput">Name</label>
        <input id="nameInput" type="text">

        <span id="nameError"></span>

        <label for="emailInput">Email</label>
        <input id="emailInput" type="email">

        <span id="emailError"></span>

        <label for="messageInput">Message</label>
        <textarea id="messageInput"></textarea>

        <span id="messageError"></span>

        <button type="submit">Send Msg</button>
      </form>
    `;

    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const messageInput = document.getElementById("messageInput");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    if (nameInput.value.trim() === "") {
      nameError.textContent = "Please enter your name.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
    }

    if (messageInput.value.trim() === "") {
      messageError.textContent = "Please write a short message.";
    }

    expect(nameError.textContent).toBe("Please enter your name.");
    expect(emailError.textContent).toBe(
      "Please enter a valid email address."
    );
    expect(messageError.textContent).toBe(
      "Please write a short message."
    );
  });


  // TEST 2
  it("shows an error for an invalid email", () => {
    document.body.innerHTML = `
      <form id="contactForm">
        <label for="nameInput">Name</label>
        <input id="nameInput" type="text" value="Anila">

        <span id="nameError"></span>

        <label for="emailInput">Email</label>
        <input id="emailInput" type="email" value="invalid-email">

        <span id="emailError"></span>

        <label for="messageInput">Message</label>
        <textarea id="messageInput">Hello</textarea>

        <span id="messageError"></span>

        <button type="submit">Send Msg</button>
      </form>
    `;

    const emailInput = document.getElementById("emailInput");
    const emailError = document.getElementById("emailError");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
    }

    expect(emailError.textContent).toBe(
      "Please enter a valid email address."
    );
  });


  // TEST 3
  it("shows an error when the name is empty", () => {
    document.body.innerHTML = `
      <form id="contactForm">
        <label for="nameInput">Name</label>
        <input id="nameInput" type="text" value="">

        <span id="nameError"></span>
      </form>
    `;

    const nameInput = document.getElementById("nameInput");
    const nameError = document.getElementById("nameError");

    if (nameInput.value.trim() === "") {
      nameError.textContent = "Please enter your name.";
    }

    expect(nameError.textContent).toBe(
      "Please enter your name."
    );
  });


  // TEST 4
  it("shows an error when the message is empty", () => {
    document.body.innerHTML = `
      <form id="contactForm">
        <label for="messageInput">Message</label>
        <textarea id="messageInput"></textarea>

        <span id="messageError"></span>
      </form>
    `;

    const messageInput = document.getElementById("messageInput");
    const messageError = document.getElementById("messageError");

    if (messageInput.value.trim() === "") {
      messageError.textContent = "Please write a short message.";
    }

    expect(messageError.textContent).toBe(
      "Please write a short message."
    );
  });


  // TEST 5
  it("accepts a valid email address", () => {
    document.body.innerHTML = `
      <label for="emailInput">Email</label>
      <input
        id="emailInput"
        type="email"
        value="anila@example.com"
      >

      <span id="emailError"></span>
    `;

    const emailInput = document.getElementById("emailInput");
    const emailError = document.getElementById("emailError");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
    }

    expect(emailError.textContent).toBe("");
  });


  // TEST 6
  it("accepts valid name, email, and message", () => {
    document.body.innerHTML = `
      <form id="contactForm">
        <label for="nameInput">Name</label>
        <input
          id="nameInput"
          type="text"
          value="Anila Ashraf"
        >

        <label for="emailInput">Email</label>
        <input
          id="emailInput"
          type="email"
          value="anila@example.com"
        >

        <label for="messageInput">Message</label>
        <textarea id="messageInput">Hello, I would like to contact you.</textarea>

        <span id="nameError"></span>
        <span id="emailError"></span>
        <span id="messageError"></span>
      </form>
    `;

    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const messageInput = document.getElementById("messageInput");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const nameIsValid = nameInput.value.trim() !== "";
    const emailIsValid = emailPattern.test(emailInput.value.trim());
    const messageIsValid = messageInput.value.trim() !== "";

    expect(nameIsValid).toBe(true);
    expect(emailIsValid).toBe(true);
    expect(messageIsValid).toBe(true);
  });

});