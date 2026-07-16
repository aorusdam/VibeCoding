document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.querySelector("#content");
  const counter = document.querySelector("#character-count");
  if (!textarea || !counter) return;
  const updateCount = () => { counter.textContent = `${textarea.value.length} / ${textarea.maxLength}`; };
  textarea.addEventListener("input", updateCount);
  updateCount();
});
