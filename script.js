document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    const toggleMenu = () => {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("open");
    };

    menuToggle.addEventListener("click", toggleMenu);

    // Close menu when a link is clicked
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("open");
      });
    });
  }

  // Smooth scroll for anchor links, accounting for nav height
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = window.innerWidth <= 768 ? 60 : 100; // Nav height based on screen size
        const offsetTop =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          navHeight;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
        // Close mobile menu after clicking anchor link
        if (navLinks && menuToggle && navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          menuToggle.classList.remove("open");
        }
      }
    });
  });

  // Remove loading overlay (if applicable)
  window.addEventListener("load", () => {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      loadingOverlay.style.opacity = "0";
      loadingOverlay.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        loadingOverlay.style.display = "none";
      }, 500);
    }
  });

  // Scroll animation handler
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of the element is visible
  };

  const fadeInElements = document.querySelectorAll(
    "section, .section-title, .about-text h3, .about-item, .activity-card, .programme-card, .team-card, .contact-info h3, .contact-form, footer"
  );

  // Fallback for browsers without Intersection Observer
  if (!("IntersectionObserver" in window)) {
    fadeInElements.forEach((element) => {
      element.style.animation = `fadeInUp 1s ease-out forwards`;
    });
  } else {
    const animatedElements = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animatedElements.has(entry.target)) {
          entry.target.style.animation = `fadeInUp 1s ease-out forwards`;
          animatedElements.add(entry.target);
        }
      });
    }, observerOptions);

    fadeInElements.forEach((element) => {
      observer.observe(element);
    });

    // Cleanup observer on page unload
    window.addEventListener("unload", () => {
      fadeInElements.forEach((element) => observer.unobserve(element));
    });
  }
});

// Form submission handler
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = this.querySelector("#name");
    const emailInput = this.querySelector("#email");
    const messageInput = this.querySelector("#message");
    const successMessage = this.querySelector("#successMessage");
    const errorMessage = this.querySelector("#errorMessage");
    const submitButton = this.querySelector(".btn");

    // Reset previous states
    if (successMessage && errorMessage) {
      successMessage.style.display = "none";
      errorMessage.style.display = "none";
    }
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) input.parentElement.classList.remove("error");
    });

    // Basic client-side validation
    let isValid = true;
    if (!nameInput?.value.trim()) {
      nameInput?.parentElement.classList.add("error");
      isValid = false;
    }
    if (
      !emailInput?.value.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
    ) {
      emailInput?.parentElement.classList.add("error");
      isValid = false;
    }
    if (!messageInput?.value.trim()) {
      messageInput?.parentElement.classList.add("error");
      isValid = false;
    }

    if (!isValid) {
      if (errorMessage) {
        errorMessage.textContent = "Please fill out all fields correctly.";
        errorMessage.style.display = "block";
      }
      return;
    }

    // Check if form action is set
    if (!this.action) {
      if (errorMessage) {
        errorMessage.textContent = "Form submission endpoint not configured.";
        errorMessage.style.display = "block";
      }
      return;
    }

    // Disable button during submission
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    try {
      const response = await fetch(this.action, {
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
        if (successMessage) successMessage.style.display = "block";
        this.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      if (errorMessage) {
        errorMessage.textContent = "An error occurred. Please try again.";
        errorMessage.style.display = "block";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
      }
    }
  });
}

// Cleanup event listeners on page unload
window.addEventListener("unload", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const contactForm = document.getElementById("contactForm");
  if (menuToggle) menuToggle.replaceWith(menuToggle.cloneNode(true));
  if (navLinks) navLinks.replaceWith(navLinks.cloneNode(true));
  if (contactForm) contactForm.replaceWith(contactForm.cloneNode(true));
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.replaceWith(anchor.cloneNode(true));
  });
});
