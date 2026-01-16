export function createAppState() {
  let mode = "corridor";

  const listeners = new Set();

  function setMode(nextMode) {
    mode = nextMode;
    listeners.forEach((listener) => listener(mode));
  }

  function onModeChange(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getMode() {
    return mode;
  }

  return { getMode, setMode, onModeChange };
}
