// Fishing Game Logic
const users = [
  { username: "admin", password: "admin123", role: "admin", inventory: [] },
  { username: "player", password: "fishy", role: "user", inventory: [] },
  { username: "Aspectz", password: "Freedom1234@", role: "user", inventory: [] },
  { username: "Jeronnlmoo", password: "123", role: "user", inventory: [] }
];
function showRegister() {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("register-section").classList.remove("hidden");
  document.getElementById("register-error").textContent = "";
}

function hideRegister() {
  document.getElementById("register-section").classList.add("hidden");
  document.getElementById("login-section").classList.remove("hidden");
  document.getElementById("register-error").textContent = "";
}

function register() {
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value;
  if (!username || !password) {
    document.getElementById("register-error").textContent = "Please enter a username and password.";
    return;
  }
  if (users.find(u => u.username === username)) {
    document.getElementById("register-error").textContent = "Username already exists.";
    return;
  }
  users.push({ username, password, role: "user", inventory: [] });
  document.getElementById("register-error").textContent = "Registered! You can now log in.";
  setTimeout(() => {
    hideRegister();
    document.getElementById("username").value = username;
  }, 1000);
}
let currentUser = null;

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    currentUser = user;
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("register-section").classList.add("hidden");
    document.getElementById("game-section").classList.remove("hidden");
    document.getElementById("welcome").textContent = `Welcome, ${user.username}!`;
    updateInventory();
    if (user.role === "admin") {
      document.getElementById("admin-panel").classList.remove("hidden");
      updateUserList();
    }
    document.getElementById("login-error").textContent = "";
  } else {
    document.getElementById("login-error").textContent = "Invalid credentials.";
  }
}

function logout() {
  currentUser = null;
  document.getElementById("login-section").classList.remove("hidden");
  document.getElementById("register-section").classList.add("hidden");
  document.getElementById("game-section").classList.add("hidden");
  document.getElementById("admin-panel").classList.add("hidden");
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("reg-username").value = "";
  document.getElementById("reg-password").value = "";
}

const fishTypes = [
  { name: "Common Carp", rarity: "Common" },
  { name: "Bass", rarity: "Common" },
  { name: "Golden Trout", rarity: "Rare" },
  { name: "Catfish", rarity: "Uncommon" },
  { name: "Legendary Koi", rarity: "Legendary" }
];

function fish() {
  if (!currentUser) return;
  // Luck-based catch
  const roll = Math.random();
  let caughtFish;
  if (roll < 0.5) caughtFish = fishTypes[0]; // Common Carp
  else if (roll < 0.7) caughtFish = fishTypes[1]; // Bass
  else if (roll < 0.85) caughtFish = fishTypes[3]; // Catfish
  else if (roll < 0.98) caughtFish = fishTypes[2]; // Golden Trout
  else caughtFish = fishTypes[4]; // Legendary Koi
  currentUser.inventory.push(caughtFish);
  document.getElementById("catch-result").textContent = `You caught a ${caughtFish.rarity} fish: ${caughtFish.name}!`;
  updateInventory();
  if (currentUser.role === "admin") updateUserList();
}

function updateInventory() {
  if (!currentUser) return;
  const inv = currentUser.inventory.map(f => `${f.name} (${f.rarity})`).join("<br>");
  document.getElementById("inventory").innerHTML = `<strong>Your Inventory:</strong><br>${inv || "No fish yet!"}`;
}

function updateUserList() {
  let html = "<strong>All Users:</strong><ul>";
  users.forEach(u => {
    html += `<li>${u.username} (${u.role}) - ${u.inventory.length} fish</li>`;
  });
  html += "</ul>";
  document.getElementById("user-list").innerHTML = html;
}
