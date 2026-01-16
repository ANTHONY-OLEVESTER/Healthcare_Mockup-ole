export function createDetailUI({ onBack, onPrev, onNext }) {
  const container = document.createElement("div");
  container.className = "detail-ui";

  const backButton = document.createElement("button");
  backButton.className = "detail-back";
  backButton.textContent = "Back";
  backButton.addEventListener("click", () => {
    if (onBack) {
      onBack();
    }
  });

  const leftButton = document.createElement("button");
  leftButton.className = "detail-arrow left";
  leftButton.textContent = "<";
  leftButton.addEventListener("click", () => {
    if (onPrev) {
      onPrev();
    }
  });

  const rightButton = document.createElement("button");
  rightButton.className = "detail-arrow right";
  rightButton.textContent = ">";
  rightButton.addEventListener("click", () => {
    if (onNext) {
      onNext();
    }
  });

  const indicator = document.createElement("div");
  indicator.className = "detail-indicator";

  const label = document.createElement("div");
  label.className = "detail-label";
  indicator.appendChild(label);

  container.appendChild(backButton);
  container.appendChild(leftButton);
  container.appendChild(rightButton);
  container.appendChild(indicator);

  function setVisible(isVisible) {
    container.style.display = isVisible ? "block" : "none";
  }

  function setIndicator(text) {
    label.textContent = text;
  }

  return {
    element: container,
    setVisible,
    setIndicator
  };
}
