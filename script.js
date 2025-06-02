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
    threshold: 0.08, // Trigger when 8% of the element is visible
  };

  const fadeInElements = document.querySelectorAll(
    "section, .section-title, .about-text h3, .about-item, .activity-card, .programme-card, .team-card, .contact-info h3, .contact-form, footer"
  );

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = `fadeInUp 1s ease-out forwards`;
      } else {
        entry.target.style.animation = `fadeOutUp 1s ease-out forwards`;
      }
    });
  }, observerOptions);

  fadeInElements.forEach((element) => {
    observer.observe(element);
  });
});
