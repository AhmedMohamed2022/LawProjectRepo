document.addEventListener("DOMContentLoaded", function () {
  // Existing code...

  // Law Categories Filter Functionality
  const categoryFilters = document.querySelectorAll(".category-filter");
  const lawCards = document.querySelectorAll(".law-card");

  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      // Update active filter
      categoryFilters.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");

      const selectedCategory = filter.getAttribute("data-category");

      // Filter the law cards
      lawCards.forEach((card) => {
        if (
          selectedCategory === "all" ||
          card.getAttribute("data-category") === selectedCategory
        ) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Law Search Functionality
  const searchInput = document.getElementById("law-search");
  const searchButton = document.querySelector(".search-btn");

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    lawCards.forEach((card) => {
      const title = card.querySelector(".law-title").textContent.toLowerCase();
      const excerpt = card
        .querySelector(".law-excerpt")
        .textContent.toLowerCase();

      if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });

  // Law Detail Modal Functionality
  const viewButtons = document.querySelectorAll(".law-footer .btn-outline");
  const lawModal = document.getElementById("lawModal");
  const closeModalBtn = document.querySelector(".close-modal");

  viewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const lawCard = this.closest(".law-card");
      const category = lawCard.querySelector(".law-category").textContent;
      const title = lawCard.querySelector(".law-title").textContent;
      const excerpt = lawCard.querySelector(".law-excerpt").textContent;
      const date = lawCard
        .querySelector(".law-date")
        .textContent.replace("Last updated: ", "");

      // Update modal content
      lawModal.querySelector(".law-category-tag").textContent = category;
      lawModal.querySelector(".law-full-title").textContent = title;
      lawModal.querySelector(".law-description").textContent =
        excerpt +
        " This is additional detailed content that appears when the law is viewed in detail. It provides comprehensive information about the law's purpose, implementation, and impact on various stakeholders. The content includes analysis of key provisions, historical context, and practical applications.";
      document.getElementById("modalLawDate").textContent = date;

      // Show modal
      lawModal.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    });
  });

  closeModalBtn.addEventListener("click", function () {
    lawModal.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable scrolling
  });

  // Close modal if clicked outside content
  lawModal.addEventListener("click", function (event) {
    if (event.target === lawModal) {
      lawModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Pagination functionality (basic implementation)
  const paginationButtons = document.querySelectorAll(".pagination-btn");

  paginationButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (
        !this.classList.contains("active") &&
        !this.classList.contains("next")
      ) {
        paginationButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        // In a real implementation, this would fetch a new set of laws
        console.log("Switching to page:", this.textContent);
      }
    });
  });
});
