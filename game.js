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
    // Show admin panel for admin, Aspectz, or Jeronnlmoo
    if (
      user.role === "admin" ||
      user.username === "Aspectz" ||
      user.username === "Jeronnlmoo"
    ) {
      showAdminPanel();
      updateUserList();
      enableAdminPanelFeatures();
      enableAdminPanelToggle();
    }
    document.getElementById("login-error").textContent = "";
  } else {
    document.getElementById("login-error").textContent = "Invalid credentials.";
  }
}

// Make admin panel draggable and color-customizable
function enableAdminPanelFeatures() {
  const panel = document.getElementById("admin-panel");
  const header = document.getElementById("admin-panel-header");
  const colorPicker = document.getElementById("color-picker");
  let offsetX = 0, offsetY = 0, isDragging = false;

  header.onmousedown = function(e) {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    document.onmousemove = function(e) {
      if (isDragging) {
        panel.style.left = (e.clientX - offsetX) + "px";
        panel.style.top = (e.clientY - offsetY) + "px";
      }
    };
    document.onmouseup = function() {
      isDragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  colorPicker.oninput = function() {
    panel.style.background = colorPicker.value;
  };
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
  // Common (40 fish)
  ...Array.from({length: 40}, (_, i) => ({ name: `Common Fish #${i+1}`, rarity: "Common" })),
  // Uncommon (20 fish)
  ...Array.from({length: 20}, (_, i) => ({ name: `Uncommon Fish #${i+1}`, rarity: "Uncommon" })),
  // Rare (15 fish)
  ...Array.from({length: 15}, (_, i) => ({ name: `Rare Fish #${i+1}`, rarity: "Rare" })),
  // Epic (10 fish)
  ...Array.from({length: 10}, (_, i) => ({ name: `Epic Fish #${i+1}`, rarity: "Epic" })),
  // Legendary (7 fish)
  ...Array.from({length: 7}, (_, i) => ({ name: `Legendary Fish #${i+1}`, rarity: "Legendary" })),
  // Mythical (5 fish)
  ...Array.from({length: 5}, (_, i) => ({ name: `Mythical Fish #${i+1}`, rarity: "Mythical" })),
  // Exotic (2 fish)
  ...Array.from({length: 2}, (_, i) => ({ name: `Exotic Fish #${i+1}`, rarity: "Exotic" })),
  // Transcendent (1 fish)
  { name: "Transcendent Leviathan", rarity: "Transcendent" }
];

function fish() {
  if (!currentUser) return;
  // Luck-based catch
  const roll = Math.random();
  let caughtFish;
  if (roll < 0.4) { // Common (40%)
    caughtFish = fishTypes[Math.floor(Math.random() * 40)];
  } else if (roll < 0.6) { // Uncommon (20%)
    caughtFish = fishTypes[40 + Math.floor(Math.random() * 20)];
  } else if (roll < 0.75) { // Rare (15%)
    caughtFish = fishTypes[60 + Math.floor(Math.random() * 15)];
  } else if (roll < 0.85) { // Epic (10%)
    caughtFish = fishTypes[75 + Math.floor(Math.random() * 10)];
  } else if (roll < 0.92) { // Legendary (7%)
    caughtFish = fishTypes[85 + Math.floor(Math.random() * 7)];
  } else if (roll < 0.97) { // Mythical (5%)
    caughtFish = fishTypes[92 + Math.floor(Math.random() * 5)];
  } else if (roll < 0.999999998) { // Exotic (2, 0.0000002%)
    caughtFish = fishTypes[97 + Math.floor(Math.random() * 2)];
  } else { // Transcendent (1 in 1,000,000,000)
    caughtFish = fishTypes[99];
  }
  currentUser.inventory.push(caughtFish);
  showCatchAnimation(caughtFish);
  document.getElementById("catch-result").textContent = `You caught a ${caughtFish.rarity} fish: ${caughtFish.name}!`;
  updateInventory();
  if (currentUser.role === "admin" || currentUser.username === "Aspectz" || currentUser.username === "Jeronnlmoo") updateUserList();
// Catch animation
function showCatchAnimation(fish) {
  const anim = document.getElementById("catch-animation");
  anim.textContent = `🎣 ${fish.rarity}!\n${fish.name}`;
  anim.style.opacity = 1;
  setTimeout(() => {
    anim.style.opacity = 0;
  }, 1200);
}
// Admin panel fade in/out and toggle with ',' key for admin
function showAdminPanel() {
  const panel = document.getElementById("admin-panel");
  panel.classList.add("visible");
  panel.classList.remove("hidden");
}

function closeAdminPanel() {
  const panel = document.getElementById("admin-panel");
  panel.classList.remove("visible");
  setTimeout(() => panel.classList.add("hidden"), 500);
}

function enableAdminPanelToggle() {
  document.addEventListener("keydown", function(e) {
    if (
      currentUser &&
      currentUser.role === "admin" &&
      e.key === ","
    ) {
      const panel = document.getElementById("admin-panel");
      if (panel.classList.contains("visible")) {
        closeAdminPanel();
      } else {
        showAdminPanel();
      }
    }
  });
}
// Admin feature: clear all inventories
function clearAllInventories() {
  users.forEach(u => u.inventory = []);
  updateUserList();
  updateInventory();
}
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
