const button = document.querySelector(".menu-toggle");
const navigation = document.getElementById("site-nav");

function setMenuOpen(isOpen) {
  if (!button || !navigation) return;

  button.setAttribute("aria-expanded", String(isOpen));
  navigation.classList.toggle("is-open", isOpen);
}

if (button && navigation) {
  button.addEventListener("click", () => {
    setMenuOpen(button.getAttribute("aria-expanded") !== "true");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      button.focus();
    }
  });
}
