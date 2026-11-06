// ---------- Get page elements ----------
const output = document.getElementById("output");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clear-btn");
const capsBtn = document.getElementById("caps-btn");
const keys = document.querySelectorAll(".key");

// ---------- Character counter ----------
function updateCounter() {
  const count = output.value.length;
  counter.textContent = count + (count === 1 ? " character" : " characters");
}

// ---------- Update letter labels ----------
function updateLetters() {
  const capsOn = capsBtn.classList.contains("active");

  keys.forEach(function (key) {
    if (key.classList.contains("letter")) {
      key.textContent = capsOn
        ? key.dataset.key.toUpperCase()
        : key.dataset.key.toLowerCase();
    }
  });

  capsBtn.setAttribute("aria-pressed", String(capsOn));
}

// ---------- Main key behavior ----------
function handleKey(key) {
  const value = key.dataset.key;
  const capsOn = capsBtn.classList.contains("active");

  if (value === "Backspace") {
    output.value = output.value.slice(0, -1);
  } else if (value === "Space") {
    output.value += " ";
  } else if (value === "Enter") {
    output.value += "\n";
  } else if (value === "Caps") {
    capsBtn.classList.toggle("active");
    updateLetters();
  } else if (key.classList.contains("letter")) {
    output.value += capsOn ? value.toUpperCase() : value.toLowerCase();
  } else {
    output.value += value;
  }

  updateCounter();
}

// ---------- Virtual keyboard clicks ----------
keys.forEach(function (key) {
  key.addEventListener("click", function () {
    handleKey(key);
  });
});

// ---------- Clear text ----------
clearBtn.addEventListener("click", function () {
  output.value = "";
  updateCounter();
});

// ---------- Real keyboard support ----------
document.addEventListener("keydown", function (event) {
  // Let browser shortcuts such as Cmd/Ctrl+R continue to work.
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  let name = event.key.toLowerCase();

  if (name === " ") name = "space";
  if (name === "capslock") name = "caps";

  const matchedKey = Array.from(keys).find(function (key) {
    return key.dataset.key.toLowerCase() === name;
  });

  if (matchedKey) {
    event.preventDefault();
    handleKey(matchedKey);
    matchedKey.classList.add("pressed");

    window.setTimeout(function () {
      matchedKey.classList.remove("pressed");
    }, 120);
  }
});

// Keep the virtual Caps state synchronized with the physical Caps Lock key.
document.addEventListener("keyup", function (event) {
  if (event.key === "CapsLock") {
    const physicalCapsOn = event.getModifierState("CapsLock");
    capsBtn.classList.toggle("active", physicalCapsOn);
    updateLetters();
  }
});

updateCounter();
