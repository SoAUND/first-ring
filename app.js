const key = "firstring-workspace";
const profileForm = document.querySelector("#profile");
const chatForm = document.querySelector("#chat");
const thread = document.querySelector("#thread");
const leadsEl = document.querySelector("#leads");
const status = document.querySelector("#status");
let draft = {};

function load() {
  return JSON.parse(localStorage.getItem(key) || '{"profile":null,"leads":[],"history":[]}');
}
function save(data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function say(role, text) {
  const el = document.createElement("div");
  el.className = "bubble " + role;
  el.textContent = text;
  thread.appendChild(el);
  thread.scrollTop = thread.scrollHeight;
}
function render() {
  const data = load();
  thread.innerHTML = "";
  leadsEl.innerHTML = "";
  if (!data.profile) {
    status.textContent = "No workspace yet";
    say("agent", "Save a business first. Then talk to the agent.");
    return;
  }
  status.textContent = data.profile.business;
  Object.entries(data.profile).forEach(([name, value]) => {
    const field = profileForm.elements[name];
    if (field) field.value = value;
  });
  say("agent", "You are through to " + data.profile.business + ". What do you need?");
  data.history.forEach((item) => say(item.role, item.text));
  if (!data.leads.length) leadsEl.textContent = "No leads yet.";
  data.leads.forEach((lead) => {
    const el = document.createElement("div");
    el.className = "lead";
    el.textContent = lead.name + " · " + lead.need + " · " + lead.when;
    leadsEl.appendChild(el);
  });
}
function reply(message) {
  const data = load();
  const profile = data.profile;
  const text = message.toLowerCase();
  draft.need = draft.need || message;
  if (!profile) return "Save the business profile first.";
  if (/price|cost|how much/.test(text)) {
    return profile.price ? "The figure I can give is " + profile.price + "." : "I cannot quote a price. I can book a visit.";
  }
  if (/emergency|leak|gas|flood|no heat|no cool/.test(text)) {
    return "That needs a person. I am marking it urgent and taking your name and callback.";
  }
  if (/book|schedule|come out|appointment|thursday|friday|tomorrow/.test(text)) {
    return "I can hold Thursday at 9am or Friday at 1pm. Which name should I put on it?";
  }
  if (!draft.name && /my name is|i am|i'm/.test(text)) {
    draft.name = message.replace(/.*(?:my name is|i am|i'm)\s+/i, "").trim();
    return "Thanks " + draft.name + ". What number should the owner call?";
  }
  if (/\d{7,}/.test(message) && draft.name) {
    draft.phone = message.match(/\d[\d\s\-]{6,}/)[0];
    data.leads.unshift({ name: draft.name, need: draft.need, when: "Thursday 9am", phone: draft.phone });
    save(data);
    draft = {};
    renderLeads();
    return "Booked Thursday at 9am. A text would go to " + (profile.notify || "the owner") + ".";
  }
  return profile.business + " handles " + profile.services + " during " + profile.hours + (profile.area ? " in " + profile.area : "") + ". I can book a visit or take a message.";
}
function renderLeads() {
  const data = load();
  leadsEl.innerHTML = "";
  if (!data.leads.length) leadsEl.textContent = "No leads yet.";
  data.leads.forEach((lead) => {
    const el = document.createElement("div");
    el.className = "lead";
    el.textContent = lead.name + " · " + lead.need + " · " + lead.when;
    leadsEl.appendChild(el);
  });
}
profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = load();
  data.profile = Object.fromEntries(new FormData(profileForm).entries());
  data.history = [];
  save(data);
  draft = {};
  render();
});
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = new FormData(chatForm).get("message");
  const data = load();
  const answer = reply(message);
  data.history.push({ role: "caller", text: message }, { role: "agent", text: answer });
  save(data);
  say("caller", message);
  say("agent", answer);
  chatForm.reset();
});
render();
