document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("open");
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Remove loading overlay (if applicable)
  window.addEventListener("load", () => {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      loadingOverlay.classList.add("fade-out");
      setTimeout(() => {
        loadingOverlay.style.display = "none";
      }, 500);
    }
  });

  // Scroll animation handler
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.01, // Trigger when 1% of the element is visible
  };

  const fadeInElements = document.querySelectorAll(
    "section, .section-title, .about-text h3, .about-item, .activity-card, .programme-card, .team-card, .contact-info h3, .contact-form, footer"
  );

  // Set to track which elements have already been animated
  const animatedElements = new Set();

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animatedElements.has(entry.target)) {
        // Element is visible and hasn't been animated yet - fade in
        entry.target.style.animation = `fadeInUp 1s ease-out forwards`;
        animatedElements.add(entry.target);
      }
      // When scrolling up, elements stay visible (no fade out)
    });
  }, observerOptions);

  fadeInElements.forEach((element) => {
    observer.observe(element);
  });
});

document
  .getElementById("contactForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const form = this;
    const nameInput = form.querySelector("#name");
    const emailInput = form.querySelector("#email");
    const messageInput = form.querySelector("#message");
    const successMessage = form.querySelector("#successMessage");
    const errorMessage = form.querySelector("#errorMessage");
    const submitButton = form.querySelector(".btn");

    // Reset previous states
    successMessage.style.display = "none";
    errorMessage.style.display = "none";
    [nameInput, emailInput, messageInput].forEach((input) => {
      input.parentElement.classList.remove("error");
    });

    // Basic client-side validation
    let isValid = true;
    if (!nameInput.value.trim()) {
      nameInput.parentElement.classList.add("error");
      isValid = false;
    }
    if (
      !emailInput.value.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
    ) {
      emailInput.parentElement.classList.add("error");
      isValid = false;
    }
    if (!messageInput.value.trim()) {
      messageInput.parentElement.classList.add("error");
      isValid = false;
    }

    if (!isValid) {
      errorMessage.textContent =
        "Veuillez remplir tous les champs correctement.";
      errorMessage.style.display = "block";
      return;
    }

    // Disable button during submission
    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          message: messageInput.value,
        }),
      });

      if (response.ok) {
        successMessage.style.display = "block";
        form.reset(); // Clear form
      } else {
        throw new Error("Échec de l'envoi");
      }
    } catch (error) {
      errorMessage.textContent =
        "Une erreur s'est produite. Veuillez réessayer.";
      errorMessage.style.display = "block";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Envoyer le Message";
    }
  });
