// Variables del jugador
let level = 1;
let xp = 0;
let xpNeeded = 10;
let health = 100;
let damage = 5;
let defense = 0;
let zeny = 0;
let playerClass = "Novice";

// Variables iniciales
let baseLevel = 1;
let jobLevel = 1;
let baseXp = 0;
let jobXp = 0;
let baseXpNeeded = 9;
let jobXpNeeded = 10;

let currentMonster = null; 

// Elementos del DOM (actualizados)
const playerClassDisplay = document.getElementById("playerClass");
const healthDisplay = document.getElementById("health");
const damageDisplay = document.getElementById("damage");
const defenseDisplay = document.getElementById("defense");
const zenyDisplay = document.getElementById("zeny");

const enemyNameDisplay = document.getElementById("enemyName");
const enemyHealthDisplay = document.getElementById("enemyHealth");

const baseLevelDisplay = document.getElementById("baseLevel");
const jobLevelDisplay = document.getElementById("jobLevel");
const baseXpDisplay = document.getElementById("baseXp");
const baseXpNeededDisplay = document.getElementById("baseXpNeeded");
const jobXpDisplay = document.getElementById("jobXp");
const jobXpNeededDisplay = document.getElementById("jobXpNeeded");
const availableLocations = locations.filter(loc => level >= loc.minLevel);

// Elementos del DOM
const fightButton = document.getElementById("fightButton");
const farmButton = document.getElementById("farmButton");
const craftButton = document.getElementById("craftButton");

const combatScreen = document.getElementById("combatScreen");
const farmingScreen = document.getElementById("farmingScreen");
const craftingScreen = document.getElementById("craftingScreen");
const locationScreen = document.getElementById("locationScreen");
const mainMenu = document.getElementById("mainMenu");

const enemyImageContainer = document.getElementById("enemyImageContainer");

// Función genérica para mostrar pantallas
function showScreen(screen, button) {
  // Ocultar todas las pantallas
  document.querySelectorAll(".content-screen").forEach(s => s.style.display = "none");

  // Mostrar la pantalla seleccionada
  screen.style.display = "block";

  // Quitar la clase 'selected' de todos los botones
  document.querySelectorAll("#mainMenu button").forEach(btn => btn.classList.remove("selected"));

  // Añadir la clase 'selected' al botón clicado
  if (button) button.classList.add("selected");
}

// Eventos para los botones del menú
fightButton.addEventListener("click", () => {
  showScreen(locationScreen, fightButton);
  renderLocationMenu();
});
farmButton.addEventListener("click", () => {
  showScreen(farmingScreen, farmButton);
});
craftButton.addEventListener("click", () => {
  showScreen(craftingScreen, craftButton);
});

// Renderizar menú de localizaciones
function renderLocationMenu() {
  locationScreen.innerHTML = "<strong>Elige una localización:</strong><br>";
  const availableLocations = locations.filter(loc => level >= loc.minLevel);
  availableLocations.forEach(loc => {
    const btn = document.createElement("button");
    btn.textContent = loc.name;
    btn.onclick = () => {
      selectLocation(loc);
      showScreen(combatScreen, fightButton);
    };
    locationScreen.appendChild(btn);
    locationScreen.appendChild(document.createTextNode(" "));
  });
}

// Seleccionar localización y generar monstruo
function selectLocation(location) {
  const monster = location.monsters[Math.floor(Math.random() * location.monsters.length)];
  currentMonster = monster; // Guarda el monstruo actual
  enemyName = monster.name;
  enemyHealth = monster.health + level * 5;
  enemyDamage = monster.damage + level;
  updateUI();
}

// Función para actualizar la interfaz
function updateUI() {
  playerClassDisplay.textContent = playerClass;
  healthDisplay.textContent = health;
  damageDisplay.textContent = damage;
  defenseDisplay.textContent = defense;
  zenyDisplay.textContent = zeny;

  enemyNameDisplay.textContent = enemyName;
  enemyHealthDisplay.textContent = enemyHealth;

  // Mostrar gif del monstruo si existe
  if (enemyImageContainer) {
    if (currentMonster && currentMonster.img) {
      enemyImageContainer.innerHTML = `<img src="${currentMonster.img}" alt="${enemyName}" style="height:64px;">`;
    } else {
      enemyImageContainer.innerHTML = "";
    }
  }

  updatePlayerInfo();
}

// Función para actualizar la información del jugador en la interfaz
function updatePlayerInfo() {
  baseLevelDisplay.textContent = baseLevel;
  jobLevelDisplay.textContent = jobLevel;
  baseXpDisplay.textContent = baseXp;
  baseXpNeededDisplay.textContent = baseXpNeeded;
  jobXpDisplay.textContent = jobXp;
  jobXpNeededDisplay.textContent = jobXpNeeded;
}

// Mostrar menú principal
function showMainMenu() {
  showScreen(mainMenu, null);
}

// Ataque al enemigo
const attackButton = document.getElementById("attackButton");
if (attackButton) {
  attackButton.addEventListener("click", () => {
    if (enemyHealth > 0) {
      // Reducir la salud del enemigo
      enemyHealth -= damage;
      enemyHealthDisplay.textContent = Math.max(enemyHealth, 0);

      // Verificar si el enemigo ha sido derrotado
      if (enemyHealth <= 0) {
        enemyDefeated();
      } else {
        // Ataque del enemigo
        health -= Math.max(enemyDamage - defense, 1); // Daño mínimo de 1
        healthDisplay.textContent = Math.max(health, 0);

        // Si el jugador muere
        if (health <= 0) {
          alert("¡Has muerto! Reiniciando...");
          resetGame();
          return;
        }
      }
    }
  });
}

// Función para manejar la derrota del enemigo
function enemyDefeated() {
  const baseXpGained = 7; // Experiencia base ganada
  const jobXpGained = 10; // Experiencia de job ganada

  // Ganar experiencia
  gainExperience(baseXpGained, jobXpGained);
  zeny += 10; 

  // Reiniciar la salud del enemigo para el próximo combate
  spawnEnemy();
  checkLevelUp();
}

// Función para ganar experiencia
function gainExperience(baseXpGained, jobXpGained) {
  // Experiencia base
  baseXp += baseXpGained;
  baseXpNeeded = window.ExpIncr.base[baseLevel] || baseXpNeeded;
  while (baseXp >= baseXpNeeded && baseLevel < 99) {
    baseXp -= baseXpNeeded;
    baseLevel++;
    baseXpNeeded = window.ExpIncr.base[baseLevel] || baseXpNeeded;
    health += 20;
    damage += 2;
    updateUI();
  }

  // Experiencia de job
  jobXp += jobXpGained;
  jobXpNeeded = window.ExpIncr.job[jobLevel] || jobXpNeeded;
  while (jobXp >= jobXpNeeded && jobLevel < 99) {
    jobXp -= jobXpNeeded;
    jobLevel++;
    jobXpNeeded = window.ExpIncr.job[jobLevel] || jobXpNeeded;
    updateUI();
  }

  updatePlayerInfo();
}

// Generar un nuevo enemigo (por defecto)
function spawnEnemy() {
  const enemies = [
    { name: "Poring", health: 20 + level * 5, damage: 3 + level },
    { name: "Lunatic", health: 30 + level * 10, damage: 5 + level },
    { name: "Fabre", health: 40 + level * 15, damage: 7 + level },
  ];
  const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
  enemyName = randomEnemy.name;
  enemyHealth = randomEnemy.health;
  enemyDamage = randomEnemy.damage;

  updateUI();
}

// Subir de nivel
function checkLevelUp() {
  if (xp >= xpNeeded) {
    level++;
    xp = 0;
    xpNeeded = Math.ceil(xpNeeded * 1.5); // Aumentar experiencia necesaria

    if (level === 11 && playerClass === "Novice") {
      resetToFirstJob();
      return;
    }

    health += 20; // Aumentar salud
    damage += 2; // Aumentar daño
    updateUI();
  }
}

// Cambiar a la primera clase
function resetToFirstJob() {
  const jobSelection = prompt(
    "¡Felicidades! Has alcanzado el nivel 10 como Novice. Elige tu nueva clase:\n1. Espadachín\n2. Mago\n3. Arquero\n4. Acolito\n5. Mercader\n6. Ladrón"
  );

  let stats = { healthBonus: 0, damageBonus: 0, defenseBonus: 0 };
  switch (jobSelection) {
    case "1":
      stats = { healthBonus: 150, damageBonus: 10, defenseBonus: 20 };
      changeClass("Espadachín", stats);
      break;
    case "2":
      stats = { healthBonus: 100, damageBonus: 20, defenseBonus: 5 };
      changeClass("Mago", stats);
      break;
    case "3":
      stats = { healthBonus: 120, damageBonus: 15, defenseBonus: 10 };
      changeClass("Arquero", stats);
      break;
    case "4":
      stats = { healthBonus: 140, damageBonus: 5, defenseBonus: 15 };
      changeClass("Acolito", stats);
      break;
    case "5":
      stats = { healthBonus: 130, damageBonus: 10, defenseBonus: 10 };
      changeClass("Mercader", stats);
      break;
    case "6":
      stats = { healthBonus: 110, damageBonus: 15, defenseBonus: 5 };
      changeClass("Ladrón", stats);
      break;
    default:
      alert("Selección inválida. Seleccionando Espadachín por defecto.");
      stats = { healthBonus: 150, damageBonus: 10, defenseBonus: 20 };
      changeClass("Espadachín", stats);
  }

  level = 1;
  xp = 0;
  xpNeeded = 10;
  health = 100 + stats.healthBonus;
  damage = 5 + stats.damageBonus;
  defense = 0 + stats.defenseBonus;
  updateUI();
  showMainMenu();
}

// Cambiar clase
function changeClass(newClass, newStats) {
  playerClass = newClass;
  health += newStats.healthBonus;
  damage += newStats.damageBonus;
  defense += newStats.defenseBonus;
}

// Recolectar Zeny
const gatherZenyButton = document.getElementById("gatherZenyButton");
if (gatherZenyButton) {
  gatherZenyButton.addEventListener("click", () => {
    zeny += 1 + Math.floor(level / 2); // Más Zeny a mayor nivel
    updateUI();
  });
}

// Crear arma
const craftWeaponButton = document.getElementById("craftWeaponButton");
if (craftWeaponButton) {
  craftWeaponButton.addEventListener("click", () => {
    if (zeny >= 50) {
      zeny -= 50;
      damage += 5; // Aumentar daño
      alert("¡Arma creada! Tu daño ha aumentado.");
      updateUI();
    } else {
      alert("No tienes suficiente Zeny para crear un arma.");
    }
  });
}

// Reiniciar el juego
function resetGame() {
  level = 1;
  xp = 0;
  xpNeeded = 10;
  health = 100;
  damage = 5;
  defense = 0;
  zeny = 0;
  playerClass = "Novice";
  spawnEnemy();
  updateUI();
  showMainMenu();
}

// Persistencia: Guardar y cargar datos
function saveGame() {
  const safe = (val, def) => (typeof val === "number" && !isNaN(val) ? val : def);

  const gameState = {
    level: safe(level, 1),
    xp: safe(xp, 0),
    xpNeeded: safe(xpNeeded, 10),
    health: safe(health, 100),
    damage: safe(damage, 5),
    defense: safe(defense, 0),
    zeny: safe(zeny, 0),
    playerClass: playerClass || "Novice",
    enemyName: enemyName || "",
    enemyHealth: safe(enemyHealth, 0),
    enemyDamage: safe(enemyDamage, 0),
    baseLevel: safe(baseLevel, 1),
    jobLevel: safe(jobLevel, 1),
    baseXp: safe(baseXp, 0),
    jobXp: safe(jobXp, 0),
    baseXpNeeded: safe(baseXpNeeded, 10),
    jobXpNeeded: safe(jobXpNeeded, 10),
  };
  localStorage.setItem("ragnarokGameState", JSON.stringify(gameState));
}

function loadGame() {
  const savedState = localStorage.getItem("ragnarokGameState");
  const gameState = JSON.parse(savedState);
  if (savedState) {
    const gameState = JSON.parse(savedState);
    level = gameState.level;
    xp = gameState.xp;
    xpNeeded = gameState.xpNeeded;
    health = gameState.health;
    damage = gameState.damage;
    defense = gameState.defense;
    zeny = gameState.zeny;
    playerClass = gameState.playerClass;
    enemyName = gameState.enemyName;
    enemyHealth = gameState.enemyHealth;
    enemyDamage = gameState.enemyDamage;
     baseLevel = gameState.baseLevel;
    jobLevel = gameState.jobLevel;
    baseXp = gameState.baseXp;
    jobXp = gameState.jobXp;
    baseXpNeeded = window.ExpIncr.base[baseLevel] || 10;
    jobXpNeeded = window.ExpIncr.job[jobLevel] || 10;

    updateUI();
  }
}

// Guardar el juego cada 10 segundos
setInterval(saveGame, 10000);

// Cargar el juego al iniciar
loadGame();

// Inicializar el juego
spawnEnemy();
showMainMenu();

// Eventos del menú principal
fightButton.addEventListener("click", () => {
  showScreen(locationScreen, fightButton);
  renderLocationMenu();
});
farmButton.addEventListener("click", () => {
  showScreen(farmingScreen, farmButton);
});
craftButton.addEventListener("click", () => {
  showScreen(craftingScreen, craftButton);
});

const escapeButton = document.getElementById("escapeButton");
if (escapeButton) {
  escapeButton.addEventListener("click", () => {
    // Reinicia el estado del enemigo
    spawnEnemy();
    updateUI();
    // Vuelve al menú principal o a la pantalla de localizaciones
    showMainMenu();
  });
}