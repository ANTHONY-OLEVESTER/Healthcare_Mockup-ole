export function createSlider({ sections, onChange, enableWheel = true }) {
  const container = document.createElement("div");
  container.className = "slider-wrap";

  const track = document.createElement("div");
  track.className = "slider-track";

  const input = document.createElement("input");
  input.type = "range";
  input.min = "0";
  input.max = String(sections.length - 1);
  input.step = "1";
  input.value = "0";

  track.appendChild(input);

  const ticks = document.createElement("div");
  ticks.className = "slider-ticks";

  const labels = sections.map((section, index) => {
    const tick = document.createElement("div");
    tick.className = "slider-tick";
    tick.textContent = section.label;
    tick.dataset.index = String(index);
    tick.addEventListener("click", () => {
      setValue(index);
    });
    ticks.appendChild(tick);
    return tick;
  });

  container.appendChild(track);
  container.appendChild(ticks);

  function setValue(value) {
    const nextIndex = Math.max(0, Math.min(sections.length - 1, value));
    input.value = String(nextIndex);
    setActive(nextIndex);
    if (onChange) {
      onChange(nextIndex);
    }
  }

  function setActive(activeIndex) {
    labels.forEach((label, index) => {
      if (index === activeIndex) {
        label.classList.add("active");
        label.classList.remove("inactive");
      } else {
        label.classList.remove("active");
        label.classList.add("inactive");
      }
    });
  }

  input.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    setActive(value);
    if (onChange) {
      onChange(value);
    }
  });

  if (enableWheel) {
    container.addEventListener("wheel", (event) => {
      if (input.disabled) {
        return;
      }
      event.preventDefault();
      const direction = event.deltaY > 0 ? 1 : -1;
      setValue(Number(input.value) + direction);
    }, { passive: false });
  }

  function setDisabled(isDisabled) {
    input.disabled = isDisabled;
    container.classList.toggle("disabled", isDisabled);
  }

  setActive(0);

  function getValue() {
    return Number(input.value);
  }

  return { element: container, setValue, setActive, setDisabled, getValue };
}
