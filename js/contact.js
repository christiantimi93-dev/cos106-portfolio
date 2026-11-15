/* =========================================================
   contact.js - contact form validation
   Rules: no field may be empty, email must be valid,
   phone number must contain digits only.
   ========================================================= */

const contactForm = document.getElementById("contact-form");
const successBox = document.getElementById("form-success");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DIGITS_ONLY = /^\d+$/;

// Each field has a list of checks; the first failing check's message is shown
const fields = [
  {
    input: document.getElementById("name"),
    error: document.getElementById("name-error"),
    checks: [
      { test: function (v) { return v !== ""; }, message: "Please enter your name." }
    ]
  },
  {
    input: document.getElementById("email"),
    error: document.getElementById("email-error"),
    checks: [
      { test: function (v) { return v !== ""; }, message: "Please enter your email address." },
      { test: function (v) { return EMAIL_PATTERN.test(v); }, message: "Please enter a valid email, e.g. name@example.com." }
    ]
  },
  {
    input: document.getElementById("phone"),
    error: document.getElementById("phone-error"),
    checks: [
      { test: function (v) { return v !== ""; }, message: "Please enter your phone number." },
      { test: function (v) { return DIGITS_ONLY.test(v); }, message: "Phone number must contain digits only (no spaces, + or -)." },
      { test: function (v) { return v.length >= 7 && v.length <= 15; }, message: "Phone number should be between 7 and 15 digits." }
    ]
  },
  {
    input: document.getElementById("message"),
    error: document.getElementById("message-error"),
    checks: [
      { test: function (v) { return v !== ""; }, message: "Please write a message." }
    ]
  }
];

function validateField(field) {
  const value = field.input.value.trim();
  const failed = field.checks.find(function (check) { return !check.test(value); });

  field.error.textContent = failed ? failed.message : "";
  field.input.classList.toggle("invalid", Boolean(failed));
  field.input.classList.toggle("valid", !failed);
  field.input.setAttribute("aria-invalid", failed ? "true" : "false");
  return !failed;
}

fields.forEach(function (field) {
  field.input.setAttribute("aria-describedby", field.error.id);
  // Validate when the user leaves a field, and re-check while they fix it
  field.input.addEventListener("blur", function () { validateField(field); });
  field.input.addEventListener("input", function () {
    if (field.input.classList.contains("invalid")) validateField(field);
  });
});

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  successBox.hidden = true;

  const results = fields.map(validateField);
  const allValid = results.every(Boolean);

  if (!allValid) {
    const firstInvalid = fields[results.indexOf(false)];
    firstInvalid.input.focus();
    return;
  }

  const name = fields[0].input.value.trim().split(" ")[0];
  successBox.textContent = "Thank you, " + name + "! Your message has been received. I'll get back to you soon.";
  successBox.hidden = false;

  contactForm.reset();
  fields.forEach(function (field) {
    field.input.classList.remove("valid", "invalid");
    field.input.removeAttribute("aria-invalid");
  });
});
