const lines = [
  ["caller", "Hi, my AC stopped cooling. It is about 86 in the house."],
  ["agent", "Sorry to hear that. I can get a tech on the schedule. What is the name and zip?"],
  ["caller", "Maria Alvarez, 32803."],
  ["agent", "I have Thursday at 9am or Friday at 1pm. Which works?"],
  ["caller", "Thursday at 9."],
  ["agent", "Booked. A text is going to the owner now with this number. Someone will confirm in the morning."]
];

const transcript = document.querySelector("#transcript");
const replay = document.querySelector("#replay");

function play() {
  transcript.innerHTML = "";
  replay.disabled = true;
  lines.forEach((line, i) => {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "bubble " + line[0];
      el.textContent = line[1];
      transcript.appendChild(el);
      if (i === lines.length - 1) replay.disabled = false;
    }, 700 * i);
  });
}

replay.addEventListener("click", play);
play();

document.querySelector("#lead").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const body = [
    "Demo request",
    "Name: " + data.get("name"),
    "Business: " + data.get("business"),
    "Phone: " + data.get("phone"),
    "Trade: " + data.get("trade")
  ].join("\n");
  document.querySelector("#form-note").textContent = "Draft opened in mail. Replace the address in script.js before this goes live.";
  window.location.href = "mailto:hello@example.com?subject=" + encodeURIComponent("First Ring demo") + "&body=" + encodeURIComponent(body);
});
