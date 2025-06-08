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
let baseXpNeeded = 10;
let jobXpNeeded = 10;

// Variables del enemigo
let enemyName = "Poring";
let enemyHealth = 20;
let enemyDamage = 3;

// Arte ASCII basado en Ragnarok Online
const asciiArt = {
  player: `
     O
    /|\\
    / \\
  `,
  poring: `
    (^_^)
   ( o o )
    \\___/
  `,
  lunatic: `
    (O.o)
   ( > < )
    -----
  `,
  fabre: `
    ^^^^^
   ( o o )
    -----
  `,
};

// Elementos del DOM (actualizados)
const playerClassDisplay = document.getElementById("playerClass");
const healthDisplay = document.getElementById("health");
const damageDisplay = document.getElementById("damage");
const defenseDisplay = document.getElementById("defense");
const zenyDisplay = document.getElementById("zeny");

const asciiArtDisplay = document.getElementById("asciiArt");
const enemyNameDisplay = document.getElementById("enemyName");
const enemyHealthDisplay = document.getElementById("enemyHealth");

const baseLevelDisplay = document.getElementById("baseLevel");
const jobLevelDisplay = document.getElementById("jobLevel");
const baseXpDisplay = document.getElementById("baseXp");
const baseXpNeededDisplay = document.getElementById("baseXpNeeded");
const jobXpDisplay = document.getElementById("jobXp");
const jobXpNeededDisplay = document.getElementById("jobXpNeeded");

// Elementos del DOM
const fightButton = document.getElementById("fightButton");
const farmButton = document.getElementById("farmButton");
const craftButton = document.getElementById("craftButton");

const combatScreen = document.getElementById("combatScreen");
const farmingScreen = document.getElementById("farmingScreen");
const craftingScreen = document.getElementById("craftingScreen");

// Mostrar la pantalla correspondiente
function showScreen(screen, button) {
  // Ocultar todas las pantallas
  document.querySelectorAll(".content-screen").forEach(s => s.classList.remove("active"));

  // Mostrar la pantalla seleccionada
  screen.classList.add("active");

  // Quitar la clase 'selected' de todos los botones
  document.querySelectorAll("#mainMenu button").forEach(btn => btn.classList.remove("selected"));

  // Añadir la clase 'selected' al botón clicado
  button.classList.add("selected");
}

// Eventos para los botones del menú
fightButton.addEventListener("click", () => {
  showScreen(combatScreen, fightButton);
});

farmButton.addEventListener("click", () => {
  showScreen(farmingScreen, farmButton);
});

craftButton.addEventListener("click", () => {
  showScreen(craftingScreen, craftButton);
});

// Función para actualizar la interfaz
function updateUI() {
  playerClassDisplay.textContent = playerClass;
  healthDisplay.textContent = health;
  damageDisplay.textContent = damage;
  defenseDisplay.textContent = defense;
  zenyDisplay.textContent = zeny;

  enemyNameDisplay.textContent = enemyName;
  enemyHealthDisplay.textContent = enemyHealth;

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
  mainMenu.style.display = "block";
  combatScreen.style.display = "none";
  farmingScreen.style.display = "none";
  craftingScreen.style.display = "none";
}

// Mostrar pantalla de combate
function showCombatScreen() {
  
  combatScreen.style.display = "block";
  farmingScreen.style.display = "none";
  craftingScreen.style.display = "none";

  asciiArtDisplay.textContent = asciiArt[enemyName.toLowerCase()] || asciiArt.poring;
}

// Mostrar pantalla de farmeo
function showFarmingScreen() {
  
  combatScreen.style.display = "none";
  farmingScreen.style.display = "block";
  craftingScreen.style.display = "none";
}

// Mostrar pantalla de creación
function showCraftingScreen() {
  
  combatScreen.style.display = "none";
  farmingScreen.style.display = "none";
  craftingScreen.style.display = "block";
}

// Ataque al enemigo
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

// Función para manejar la derrota del enemigo
function enemyDefeated() {
  const baseXpGained = 7; // Experiencia base ganada
  const jobXpGained = 10; // Experiencia de job ganada

  // Ganar experiencia
  gainExperience(baseXpGained, jobXpGained);

  // Ganar experiencia y Zeny
  xp += 5; // Ganar experiencia
  zeny += 10; // Ganar Zeny

  // Reiniciar la salud del enemigo para el próximo combate
  spawnEnemy();
  checkLevelUp();
}

// Función para ganar experiencia
function gainExperience(baseXpGained, jobXpGained) {
  // Incrementar experiencia base
  baseXp += baseXpGained;
  if (baseXp >= baseXpNeeded) {
    baseXp -= baseXpNeeded;
    baseLevel++;
    baseXpNeeded = Math.floor(baseXpNeeded * 1.5); // Incremento de dificultad
  }

  // Incrementar experiencia de job
  jobXp += jobXpGained;
  if (jobXp >= jobXpNeeded) {
    jobXp -= jobXpNeeded;
    jobLevel++;
    jobXpNeeded = Math.floor(jobXpNeeded * 1.5); // Incremento de dificultad
  }

  // Actualizar la interfaz
  updatePlayerInfo();
}

// Generar un nuevo enemigo
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

  asciiArtDisplay.textContent = asciiArt[enemyName.toLowerCase()] || asciiArt.poring;
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

  switch (jobSelection) {
    case "1":
      changeClass("Espadachín", { healthBonus: 150, damageBonus: 10, defenseBonus: 20 });
      break;
    case "2":
      changeClass("Mago", { healthBonus: 100, damageBonus: 20, defenseBonus: 5 });
      break;
    case "3":
      changeClass("Arquero", { healthBonus: 120, damageBonus: 15, defenseBonus: 10 });
      break;
    case "4":
      changeClass("Acolito", { healthBonus: 140, damageBonus: 5, defenseBonus: 15 });
      break;
    case "5":
      changeClass("Mercader", { healthBonus: 130, damageBonus: 10, defenseBonus: 10 });
      break;
    case "6":
      changeClass("Ladrón", { healthBonus: 110, damageBonus: 15, defenseBonus: 5 });
      break;
    default:
      alert("Selección inválida. Seleccionando Espadachín por defecto.");
      changeClass("Espadachín", { healthBonus: 150, damageBonus: 10, defenseBonus: 20 });
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
gatherZenyButton.addEventListener("click", () => {
  zeny += 1 + Math.floor(level / 2); // Más Zeny a mayor nivel
  updateUI();
});

// Crear arma
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
  const gameState = {
    level,
    xp,
    xpNeeded,
    health,
    damage,
    defense,
    zeny,
    playerClass,
    enemyName,
    enemyHealth,
    enemyDamage,
    baseLevel,
    jobLevel,
    baseXp,
    jobXp,
    baseXpNeeded,
    jobXpNeeded,
  };
  localStorage.setItem("ragnarokGameState", JSON.stringify(gameState));
}

function loadGame() {
  const savedState = localStorage.getItem("ragnarokGameState");
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
    baseXpNeeded = gameState.baseXpNeeded;
    jobXpNeeded = gameState.jobXpNeeded;

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
fightButton.addEventListener("click", showCombatScreen);
farmButton.addEventListener("click", showFarmingScreen);
craftButton.addEventListener("click", showCraftingScreen);